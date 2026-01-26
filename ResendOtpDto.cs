using System.ComponentModel.DataAnnotations;

namespace Do_an.DTO
{
    public class ResendOtpDto
    {
        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = null!;
    }
}

