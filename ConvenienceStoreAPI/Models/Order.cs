namespace ConvenienceStoreAPI.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } // "COD" hoặc "VNPAY"
        public string Status { get; set; } = "Pending"; // "Pending", "Completed", "Cancelled"
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
