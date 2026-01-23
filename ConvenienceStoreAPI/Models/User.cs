using System.ComponentModel.DataAnnotations;

namespace ConvenienceStoreAPI.Models
{
    // Model cho User (Khách hàng hoặc Nhân viên)
    public class User
    {
        public int Id { get; set; }

        public string? AvatarUrl { get; set; } 

        public string Name { get; set; } = string.Empty; 

        public int Age { get; set; } 

        public string Gender { get; set; } = string.Empty; // "Nam" hoặc "Nữ"

        public string Address { get; set; } = string.Empty; 

        public string Tele { get; set; } = string.Empty; 

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Thông tin tài khoản (nếu có)
        public UserAccount? Account { get; set; }
    }

    // Model cho tài khoản đăng nhập
    public class UserAccount
    {
        public int Id { get; set; }

        public int UserId { get; set; } 

        public string Username { get; set; } = string.Empty; 

        public string Password { get; set; } = string.Empty; 

        public string Role { get; set; } = string.Empty; // "ADMIN" hoặc "CUSTOMER"

        public bool IsActive { get; set; } = true; 

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Liên kết với User
        public User User { get; set; } = null!;
    }
}