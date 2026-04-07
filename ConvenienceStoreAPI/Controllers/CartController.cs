using ConvenienceStoreAPI.DTOs.Cart;
using ConvenienceStoreAPI.Infrastructure.CartStrategies;
using ConvenienceStoreAPI.Infrastructure.Repositories;
using ConvenienceStoreAPI.Observer;
using Microsoft.AspNetCore.Mvc;

namespace ConvenienceStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepo;
        private readonly ICartPriceStrategy _priceStrategy;
        private readonly NotificationSubject _notificationSubject;

        public CartController(ICartRepository cartRepo, NotificationSubject notificationSubject)
        {
            _cartRepo = cartRepo;
            _priceStrategy = new DefaultPriceStrategy(); // Strategy Pattern
            _notificationSubject = notificationSubject;

            // Attach Observer
            _notificationSubject.Attach(new NotificationLogger());
        }
        public CartController(ICartRepository cartRepo, ICartPriceStrategy priceStrategy)
        {
            _cartRepo = cartRepo;
            _priceStrategy = priceStrategy;  // Inject thay vì hardcode
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

            // Observer Notification
            _notificationSubject.Notify(
                dto.UserId,
                $"User {dto.UserId} đã thêm sản phẩm {dto.ProductId} vào giỏ hàng"
            );

            return Ok(new { message = "Đã thêm vào giỏ hàng" });
        }

        [HttpDelete("item/{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            await _cartRepo.RemoveItemAsync(id);

            _notificationSubject.Notify(
                0,
                $"Một sản phẩm trong giỏ hàng vừa bị xóa (ItemId: {id})"
            );

            return Ok();
        }
    }
}