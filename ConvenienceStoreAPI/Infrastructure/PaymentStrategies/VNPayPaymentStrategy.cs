using ConvenienceStoreAPI.Infrastructure.PaymentStrategies;
using Microsoft.Extensions.Configuration;
using System.Globalization;
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
        // Đọc thông tin từ appsettings.json
        var vnp_TmnCode = _configuration["VNPay:TmnCode"];
        var vnp_HashSecret = _configuration["VNPay:HashSecret"];
        var vnp_Url = _configuration["VNPay:BaseUrl"];
        var ngrokUrl = _configuration["VNPay:NgrokUrl"];

        var vnpayData = new SortedList<string, string>(new VNPayComparer());
        vnpayData.Add("vnp_Version", "2.1.0");
        vnpayData.Add("vnp_Command", "pay");
        vnpayData.Add("vnp_TmnCode", vnp_TmnCode);
        vnpayData.Add("vnp_Amount", ((long)amount * 100).ToString());
        vnpayData.Add("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
        vnpayData.Add("vnp_CurrCode", "VND");
        vnpayData.Add("vnp_IpAddr", "127.0.0.1");
        vnpayData.Add("vnp_Locale", "vn");
        vnpayData.Add("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
        vnpayData.Add("vnp_OrderType", "other");
        vnpayData.Add("vnp_ReturnUrl", $"{ngrokUrl}/api/order/vnpay-return");
        vnpayData.Add("vnp_TxnRef", orderId);

        StringBuilder data = new StringBuilder();
        foreach (var kv in vnpayData)
        {
            data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
        }

        string rawData = data.ToString().Remove(data.Length - 1);
        string vnp_SecureHash = HmacSHA512(vnp_HashSecret, rawData);

        return vnp_Url + "?" + rawData + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    private string HmacSHA512(string key, string inputData)
    {
        var hash = new StringBuilder();
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);
        byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
        using var hmac = new HMACSHA512(keyBytes);
        byte[] hashValue = hmac.ComputeHash(inputBytes);
        foreach (var theByte in hashValue) hash.Append(theByte.ToString("x2"));
        return hash.ToString();
    }
}

// LỚP FIX LỖI: Định nghĩa VNPayComparer ngay trong file này (nhưng ngoài class Strategy)
public class VNPayComparer : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x == y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}