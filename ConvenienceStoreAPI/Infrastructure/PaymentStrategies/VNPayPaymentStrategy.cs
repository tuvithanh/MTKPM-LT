using ConvenienceStoreAPI.Infrastructure.PaymentStrategies;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Security.Cryptography;
using System.Text;

public class VNPayPaymentStrategy : IPaymentStrategy
{
    private readonly IConfiguration _configuration;

    public VNPayPaymentStrategy(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string> ProcessPayment(decimal amount, string orderId)
    {
        // Lấy cấu hình VNPay từ appsettings.json
        string baseUrl = _configuration["VNPay:BaseUrl"];
        string returnUrl = _configuration["VNPay:ReturnUrl"];
        string tmnCode = _configuration["VNPay:TmnCode"];
        string hashSecret = _configuration["VNPay:HashSecret"];
        string version = _configuration["VNPay:Version"];
        string command = _configuration["VNPay:Command"];
        string currCode = _configuration["VNPay:CurrCode"];
        string locale = _configuration["VNPay:Locale"];

        // Chuẩn bị thông tin giao dịch
        string txnRef = orderId;
        string amountVNPay = ((long)amount * 100).ToString();
        string ipAddress = "127.0.0.1";

        // Tạo SortedDictionary theo alphabetical order (REQUIRED by VNPay)
        var vnp_Params = new SortedDictionary<string, string>
        {
            {"vnp_Amount", amountVNPay},
            {"vnp_Command", command},
            {"vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")},
            {"vnp_CurrCode", currCode},
            {"vnp_IpAddr", ipAddress},
            {"vnp_Locale", locale},
            {"vnp_OrderInfo", "Thanh toan don hang " + orderId},
            {"vnp_OrderType", "other"},
            {"vnp_ReturnUrl", returnUrl},
            {"vnp_TmnCode", tmnCode},
            {"vnp_TxnRef", txnRef},
            {"vnp_Version", version}
        };

        // Build hash data - theo chuẩn VNPay: URL-ENCODED query string
        string hashData = "";
        int i = 0;
        foreach (var item in vnp_Params)
        {
            if (i == 1)
            {
                hashData += "&" + WebUtility.UrlEncode(item.Key) + "=" + WebUtility.UrlEncode(item.Value);
            }
            else
            {
                hashData += WebUtility.UrlEncode(item.Key) + "=" + WebUtility.UrlEncode(item.Value);
                i = 1;
            }
        }

        // Tính HMAC SHA512 từ URL-ENCODED hash data (VNPay requirement)
        string secureHash = HmacSHA512(hashSecret, hashData);

        // Build payment URL
        string paymentUrl = baseUrl + "?" + hashData + "&vnp_SecureHash=" + secureHash;

        return paymentUrl;
    }

    private string HmacSHA512(string key, string input)
    {
        var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
        return BitConverter.ToString(hash).Replace("-", "").ToLower();
    }
}