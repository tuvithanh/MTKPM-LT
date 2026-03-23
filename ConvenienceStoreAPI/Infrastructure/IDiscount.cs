namespace ConvenienceStoreAPI.Infrastructure.Discount
{
    public interface IDiscount
    {
        decimal GetFinalPrice();
        string GetDescription();
        List<string> GetAppliedDiscounts();
    }
}
