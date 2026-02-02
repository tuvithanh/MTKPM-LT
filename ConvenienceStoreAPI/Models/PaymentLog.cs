namespace ConvenienceStoreAPI.Models
{
    public class PaymentLog
    {
        public int Id { get; set; }
        public string OrderId { get; set; }
        public string TransactionId { get; set; } // Mã GD từ VNPay
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } // "00" là thành công
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
