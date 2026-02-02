namespace ConvenienceStoreAPI.Models
{
    // Đại diện cho giỏ hàng của một User
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        // Liên kết với User đã có của bạn
        public User? User { get; set; }

        // Danh sách các món đồ trong giỏ
        public List<CartItem> Items { get; set; } = new List<CartItem>();
    }

    // Chi tiết từng sản phẩm trong giỏ
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // Liên kết để lấy thông tin sản phẩm (Tên, Giá, Ảnh)
        public Product? Product { get; set; }
    }
}