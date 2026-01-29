using ConvenienceStoreAPI.DTOs.Auth;
using ConvenienceStoreAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ConvenienceStoreAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) => _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request) =>
            Ok(await _authService.RegisterAsync(request));

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            // Gắn Cookie vào Response
            Response.Cookies.Append("JWT_Token", result.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Chỉ chạy trên HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            // Trả về thông tin user (không trả về Token trong body nữa cho bảo mật)
            return Ok(new { result.Username, result.Role });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("JWT_Token");
            return Ok(new { message = "Đã đăng xuất" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request) =>
            await _authService.ChangePasswordAsync(request) ? Ok("Thành công") : BadRequest("Thất bại");
    }
}