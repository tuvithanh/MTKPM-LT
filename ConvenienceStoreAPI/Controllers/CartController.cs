using ConvenienceStoreAPI.DTOs.Cart;
using ConvenienceStoreAPI.Infrastructure.CartStrategies;
using ConvenienceStoreAPI.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConvenienceStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepo;
        private readonly ICartPriceStrategy _priceStrategy;

        public CartController(ICartRepository cartRepo)
        {
            _cartRepo = cartRepo;
            _priceStrategy = new DefaultPriceStrategy(); // Có thể dùng Factory để đổi Strategy
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _cartRepo.GetCartByUserIdAsync(userId);
            var total = _priceStrategy.CalculateTotal(cart.Items);
            return Ok(new { cart, totalPrice = total });
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CartItemDTO dto)
        {
            await _cartRepo.AddToCartAsync(dto.UserId, dto.ProductId, dto.Quantity);
            return Ok(new { message = "Đã thêm vào giỏ hàng" });
        }

        [HttpDelete("item/{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _cartRepo.RemoveItemAsync(id);
            return Ok();
        }
    }
}