namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public class PercentageDiscount : DiscountDecorator
    {
        private readonly decimal _discountPercent;
        private readonly string _discountCode;

        public PercentageDiscount(
            IDiscount component,
            decimal discountPercent,
            string discountCode = "DISCOUNT")
            : base(component)
        {
            if (discountPercent < 0 || discountPercent > 100)
                throw new ArgumentException("Phần trăm giảm giá phải từ 0 đến 100");

            _discountPercent = discountPercent;
            _discountCode = discountCode;
        }

        public override decimal GetFinalPrice()
        {
            decimal basePrice = base.GetFinalPrice();
            decimal discountAmount = basePrice * (_discountPercent / 100);
            return basePrice - discountAmount;
        }

        public override string GetDescription()
        {
            decimal basePrice = base.GetFinalPrice();
            decimal discountAmount = basePrice * (_discountPercent / 100);
            return $"{base.GetDescription()}\n- Mã giảm: {_discountCode} ({_discountPercent}%) -Giảm: {discountAmount:C}\n" +
                   $"- Giá cuối: {GetFinalPrice():C}";
        }

        public override List<string> GetAppliedDiscounts()
        {
            var discounts = base.GetAppliedDiscounts();
            discounts.Add($"{_discountCode}: {_discountPercent}%");
            return discounts;
        }
    }
}
 
