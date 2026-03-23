namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public class BaseProduct : IDiscount
    {
        private readonly decimal _originalPrice;
        private readonly string _productName;
        private readonly List<string> _appliedDiscounts = new();

        public BaseProduct(string productName, decimal price)
        {
            _productName = productName;
            _originalPrice = price;
        }

        public decimal GetFinalPrice() => _originalPrice;

        public string GetDescription() => $"{_productName} - Giá gốc: {_originalPrice:C}";

        public List<string> GetAppliedDiscounts() => _appliedDiscounts;

        public decimal GetOriginalPrice() => _originalPrice;

        public string GetProductName() => _productName;
    }
}
