namespace ConvenienceStoreAPI.DTOs.Cart
{
    public class CartItemDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; } // Giữ nguyên để Add to Cart dùng
        public int UserId { get; set; }    // Giữ nguyên để Add to Cart dùng

        // Thêm dấu ? cho các trường KHÔNG có khi Checkout
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
    }
}