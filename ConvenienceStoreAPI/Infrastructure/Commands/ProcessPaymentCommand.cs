using ConvenienceStoreAPI.Infrastructure.Factories;

namespace ConvenienceStoreAPI.Infrastructure.Commands
{
    public class ProcessPaymentCommand : ICommand
    {
        private readonly IConfiguration _configuration;
        private readonly decimal _amount;
        private readonly string _orderId;
        private readonly string _paymentMethod;
        private string _paymentResult;

        public ProcessPaymentCommand(IConfiguration configuration, decimal amount, string orderId, string paymentMethod)
        {
            _configuration = configuration;
            _amount = amount;
            _orderId = orderId;
            _paymentMethod = paymentMethod;
        }

        public async Task ExecuteAsync()
        {
            var strategy = PaymentFactory.Create(_paymentMethod, _configuration);
            _paymentResult = await strategy.ProcessPayment(_amount, _orderId);
        }

        public string GetPaymentResult() => _paymentResult;
    }
}