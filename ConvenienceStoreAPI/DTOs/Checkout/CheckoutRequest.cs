using ConvenienceStoreAPI.DTOs.Cart;

namespace ConvenienceStoreAPI.DTOs.Checkout
{
    public class CheckoutRequest
    {
        public int UserId { get; set; }
        public string PaymentMethod { get; set; } = "COD"; // Mặc định là COD
        public List<CartItemDTO> Items { get; set; } = new List<CartItemDTO>();
    }
}