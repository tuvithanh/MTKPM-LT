using System.ComponentModel.DataAnnotations;

namespace Do_an.DTO
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Tên người dùng là bắt buộc")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        public string Password { get; set; } = null!;
    }
}
