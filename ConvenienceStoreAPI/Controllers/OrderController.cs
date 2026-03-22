using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Checkout;
using ConvenienceStoreAPI.Infrastructure.Commands;
using ConvenienceStoreAPI.Infrastructure.Factories;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ConvenienceStoreAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly OrderCommandExecutor _commandExecutor;

        public OrderController(AppDbContext db, IConfiguration configuration, OrderCommandExecutor commandExecutor)
        {
            _db = db;
            _configuration = configuration;
            _commandExecutor = commandExecutor;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
        {
            if (req == null || !req.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ" });

            // Tạo và thực thi CreateOrderCommand
            var createOrderCmd = new CreateOrderCommand(_db, req);
            await _commandExecutor.ExecuteAsync(createOrderCmd);
            var order = createOrderCmd.GetOrder();

            // Tạo và thực thi ProcessPaymentCommand
            var processPaymentCmd = new ProcessPaymentCommand(_configuration, order.TotalAmount, order.Id.ToString(), req.PaymentMethod);
            await _commandExecutor.ExecuteAsync(processPaymentCmd);
            var paymentResult = processPaymentCmd.GetPaymentResult();

            return Ok(new
            {
                OrderId = order.Id,
                PaymentUrl = req.PaymentMethod == "VNPAY" ? paymentResult : null,
                Message = req.PaymentMethod == "COD" ? "Đặt hàng thành công" : "Đang chuyển hướng thanh toán"
            });
        }

        [HttpGet("vnpay-return")]
        [AllowAnonymous]
        public async Task<IActionResult> VNPayReturn()
        {
            var query = HttpContext.Request.Query;

            // Lấy các parameter từ VNPay (bỏ qua vnp_SecureHash)
            var vnpData = query
                .Where(kvp => kvp.Key.StartsWith("vnp_") && kvp.Key != "vnp_SecureHash")
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());

            // Sort theo alphabetical order
            var sorted = new SortedDictionary<string, string>(vnpData);

            // Build URL-encoded hash data (theo chuẩn VNPay)
            string hashData = "";
            int i = 0;
            foreach (var item in sorted)
            {
                if (i == 1)
                {
                    hashData += "&" + System.Net.WebUtility.UrlEncode(item.Key) + "=" + System.Net.WebUtility.UrlEncode(item.Value);
                }
                else
                {
                    hashData += System.Net.WebUtility.UrlEncode(item.Key) + "=" + System.Net.WebUtility.UrlEncode(item.Value);
                    i = 1;
                }
            }

            string secureHash = query["vnp_SecureHash"];
            string hashSecret = _configuration["VNPay:HashSecret"];

            // Tính hash và so sánh
            string computedHash = HmacSHA512(hashSecret, hashData);
            bool isValidSignature = secureHash.Equals(computedHash, StringComparison.InvariantCultureIgnoreCase);

            string vnp_ResponseCode = query["vnp_ResponseCode"];
            string vnp_TxnRef = query["vnp_TxnRef"];
            string vnp_TransactionNo = query["vnp_TransactionNo"];

            var log = new PaymentLog
            {
                OrderId = vnp_TxnRef,
                TransactionId = vnp_TransactionNo,
                Amount = query.ContainsKey("vnp_Amount") ? Convert.ToDecimal(query["vnp_Amount"]) / 100 : 0,
                Status = vnp_ResponseCode,
                Description = !isValidSignature ? "Sai chữ ký VNPay" : (vnp_ResponseCode == "00" ? "Thanh toán thành công" : "Thanh toán thất bại")
            };
            _db.PaymentLogs.Add(log);

            // Chỉ cập nhật order nếu signature valid và response code == "00"
            if (isValidSignature && vnp_ResponseCode == "00")
            {
                var order = await _db.Orders.FindAsync(int.Parse(vnp_TxnRef));
                if (order != null) order.Status = "Paid";
            }

            await _db.SaveChangesAsync();

            // Redirect về trang order-success với query parameters URL-encoded
            string redirectUrl = $"http://localhost:5173/order-success?id={System.Net.WebUtility.UrlEncode(vnp_TxnRef)}&status={vnp_ResponseCode}";
            return Redirect(redirectUrl);
        }

        private string HmacSHA512(string key, string input)
        {
            var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}