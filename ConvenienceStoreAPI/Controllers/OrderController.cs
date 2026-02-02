using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Checkout;
using ConvenienceStoreAPI.Infrastructure.Factories;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConvenienceStoreAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;

        public OrderController(AppDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
        {
            if (req == null || !req.Items.Any())
                return BadRequest(new { message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ" });

            // 1. Tạo bản ghi Order & OrderDetail
            var order = new Order
            {
                UserId = req.UserId,
                TotalAmount = req.Items.Sum(i => i.Price * i.Quantity),
                PaymentMethod = req.PaymentMethod,
                OrderDate = DateTime.Now,
                Status = "Pending",
                OrderDetails = req.Items.Select(i => new OrderDetail
                {
                    ProductId = i.Id, // i.Id từ React gửi lên là ID sản phẩm
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // 2. Xử lý thanh toán qua Factory
            var strategy = PaymentFactory.Create(req.PaymentMethod, _configuration);
            // Result có thể là URL (VNPay) hoặc chuỗi thông báo "Success" (COD)
            string result = await strategy.ProcessPayment(order.TotalAmount, order.Id.ToString());

            // Trả về JSON đồng nhất cho Frontend
            return Ok(new
            {
                OrderId = order.Id,
                PaymentUrl = req.PaymentMethod == "VNPAY" ? result : null,
                Message = req.PaymentMethod == "COD" ? "Đặt hàng thành công" : "Đang chuyển hướng thanh toán"
            });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            var vnpayData = Request.Query;
            string vnp_ResponseCode = vnpayData["vnp_ResponseCode"];
            string vnp_TxnRef = vnpayData["vnp_TxnRef"]; // Đây là OrderId
            string vnp_TransactionNo = vnpayData["vnp_TransactionNo"];

            // Lưu Log
            var log = new PaymentLog
            {
                OrderId = vnp_TxnRef,
                TransactionId = vnp_TransactionNo,
                Amount = vnpayData.ContainsKey("vnp_Amount") ? Convert.ToDecimal(vnpayData["vnp_Amount"]) / 100 : 0,
                Status = vnp_ResponseCode,
                Description = vnp_ResponseCode == "00" ? "Thanh toán thành công" : "Thanh toán thất bại"
            };
            _db.PaymentLogs.Add(log);

            if (vnp_ResponseCode == "00")
            {
                var order = await _db.Orders.FindAsync(int.Parse(vnp_TxnRef));
                if (order != null) order.Status = "Paid";
            }

            await _db.SaveChangesAsync();

            // Chuyển hướng về Frontend (React) kèm thông tin kết quả
            return Redirect($"http://localhost:5173/order-success?id={vnp_TxnRef}&status={vnp_ResponseCode}");
        }
    }
}