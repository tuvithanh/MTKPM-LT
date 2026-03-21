namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public class FixedAmountDiscount : DiscountDecorator
    {
        private readonly decimal _discountAmount;
        private readonly string _discountCode;
        private readonly decimal _minimumPrice;

        public FixedAmountDiscount(
            IDiscount component,
            decimal discountAmount,
            string discountCode = "FIXED",
            decimal minimumPrice = 0)
            : base(component)
        {
            if (discountAmount < 0)
                throw new ArgumentException("Số tiền giảm không được âm");

            _discountAmount = discountAmount;
            _discountCode = discountCode;
            _minimumPrice = minimumPrice;
        }

        public override decimal GetFinalPrice()
        {
            decimal basePrice = base.GetFinalPrice();
            decimal finalPrice = basePrice - _discountAmount;
            return finalPrice < _minimumPrice ? _minimumPrice : finalPrice;
        }

        public override string GetDescription()
        {
            decimal basePrice = base.GetFinalPrice();
            return $"{base.GetDescription()}\n- Mã giảm: {_discountCode} -Giảm: {_discountAmount:C}\n" +
                   $"- Giá cuối: {GetFinalPrice():C}";
        }

        public override List<string> GetAppliedDiscounts()
        {
            var discounts = base.GetAppliedDiscounts();
            discounts.Add($"{_discountCode}: {_discountAmount:C}");
            return discounts;
        }
    }
}
