namespace ConvenienceStoreAPI.Infrastructure.PaymentStrategies
{
    public interface IPaymentStrategy
    {
        // Trả về kết quả xử lý (có thể là link thanh toán hoặc tin nhắn)
        Task<string> ProcessPayment(decimal amount, string orderId);
    }
}
