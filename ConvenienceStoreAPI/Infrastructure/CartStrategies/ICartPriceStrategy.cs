using ConvenienceStoreAPI.Models;

namespace ConvenienceStoreAPI.Infrastructure.CartStrategies
{
    public interface ICartPriceStrategy
    {
        decimal CalculateTotal(IEnumerable<CartItem> items);
    }
}
