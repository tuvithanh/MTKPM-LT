using ConvenienceStoreAPI.Models;

namespace ConvenienceStoreAPI.Infrastructure.CartStrategies
{
    public class DefaultPriceStrategy : ICartPriceStrategy
    {
        public decimal CalculateTotal(IEnumerable<CartItem> items)
        {
            // Tổng = Giá sản phẩm * Số lượng
            return items.Sum(item => item.Product.Price * item.Quantity);
        }
    }
}
