using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ConvenienceStoreAPI.Models
{
    public class Category
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [JsonIgnore] // ⭐ rất quan trọng
    public ICollection<Product>? Products { get; set; }
}
}

