using ConvenienceStoreAPI.Models;

namespace ConvenienceStoreAPI.Infrastructure.Repositories
{
    public interface ICartRepository
    {
        Task<Cart> GetCartByUserIdAsync(int userId);
        Task AddToCartAsync(int userId, int productId, int quantity);
        Task UpdateQuantityAsync(int cartItemId, int quantity);
        Task RemoveItemAsync(int cartItemId);
    }
}
