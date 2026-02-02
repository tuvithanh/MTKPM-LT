namespace ConvenienceStoreAPI.Infrastructure.PaymentStrategies
{
    public class CODPaymentStrategy : IPaymentStrategy
    {
        public async Task<string> ProcessPayment(decimal amount, string orderId)
            => await Task.FromResult("COD_SUCCESS");
    }
}
