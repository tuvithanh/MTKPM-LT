namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public class BulkDiscount : DiscountDecorator
    {
        private readonly int _quantity;
        private readonly int _minimumQuantity;
        private readonly decimal _discountPercent;

        public BulkDiscount(
            IDiscount component,
            int quantity,
            int minimumQuantity,
            decimal discountPercent)
            : base(component)
        {
            _quantity = quantity;
            _minimumQuantity = minimumQuantity;
            _discountPercent = discountPercent;
        }

        public override decimal GetFinalPrice()
        {
            decimal basePrice = base.GetFinalPrice();

            if (_quantity >= _minimumQuantity)
            {
                decimal discountAmount = basePrice * (_discountPercent / 100);
                return basePrice - discountAmount;
            }

            return basePrice;
        }

        public override string GetDescription()
        {
            string bulkText = _quantity >= _minimumQuantity
                ? $"Giảm {_discountPercent}% cho mua lẻ từ {_minimumQuantity}+ sản phẩm"
                : $"Chưa đạt số lượng tối thiểu ({_minimumQuantity})";

            return $"{base.GetDescription()}\n- {bulkText}\n- Giá cuối: {GetFinalPrice():C}";
        }

        public override List<string> GetAppliedDiscounts()
        {
            var discounts = base.GetAppliedDiscounts();
            if (_quantity >= _minimumQuantity)
                discounts.Add($"BULK_DISCOUNT: {_discountPercent}% (Số lượng: {_quantity})");
            return discounts;
        }
    }
}
