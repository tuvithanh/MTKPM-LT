using System.ComponentModel.DataAnnotations;

namespace Do_an.DTO
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Tên người dùng là bắt buộc")]
        [MinLength(3, ErrorMessage = "Tên người dùng phải có ít nhất 3 ký tự")]
        [MaxLength(100, ErrorMessage = "Tên người dùng không được vượt quá 100 ký tự")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [MaxLength(200, ErrorMessage = "Email không được vượt quá 200 ký tự")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string Password { get; set; } = null!;
    }
}
