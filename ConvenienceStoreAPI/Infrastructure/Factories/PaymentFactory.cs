using ConvenienceStoreAPI.Infrastructure.PaymentStrategies;

namespace ConvenienceStoreAPI.Infrastructure.Factories
{
    public static class PaymentFactory
    {
        public static IPaymentStrategy Create(string method, IConfiguration config)
        {
            return method.ToUpper() switch
            {
                "VNPAY" => new VNPayPaymentStrategy(config), // Truyền config vào đây
                "COD" => new CODPaymentStrategy(),
                _ => throw new Exception("Phương thức không hỗ trợ")
            };
        }
    }
}
