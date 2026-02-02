using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ConvenienceStoreAPI.Models
{
    public class Product
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // Thêm trường giá nhập để tính lợi nhuận
        [Column(TypeName = "decimal(18,2)")]
        public decimal CostPrice { get; set; }

        // Hình ảnh sản phẩm (Lưu URL)
        public string? ImageUrl { get; set; }

        // Mã vạch để quét tại quầy
        public string? Barcode { get; set; }

        // Đơn vị tính: Cái, Chai, Gói, Lon...
        [StringLength(50)]
        public string? Unit { get; set; }

        // Số lượng tồn kho
        public int StockQuantity { get; set; }

        // Trạng thái kinh doanh
        public bool IsActive { get; set; } = true;

        // Mô tả chi tiết
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Quan hệ với Category
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        [JsonIgnore]
        public Category? Category { get; set; }
    }
}