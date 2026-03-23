namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public abstract class DiscountDecorator : IDiscount
    {
        protected IDiscount _component;
        protected DiscountDecorator(IDiscount component)
        {
            _component = component;
        }

        public virtual decimal GetFinalPrice() => _component.GetFinalPrice();

        public virtual string GetDescription() => _component.GetDescription();

        public virtual List<string> GetAppliedDiscounts() => _component.GetAppliedDiscounts();
    }
}
