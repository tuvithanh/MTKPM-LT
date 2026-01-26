using Do_an.Data;
using Do_an.DTO;
using Do_an.Models;
using Do_an.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Do_an.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DoAnDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IOTPService _otpService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            DoAnDbContext context, 
            IConfiguration config,
            IEmailService emailService,
            IOTPService otpService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _otpService = otpService;
            _logger = logger;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // Validate model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra username đã tồn tại
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName))
            {
                return BadRequest(new { message = "Tên người dùng đã tồn tại" });
            }

            // Kiểm tra email đã tồn tại
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email đã được sử dụng" });
            }

            try
            {
                // Tạo mã OTP
                var otpCode = _otpService.GenerateOtp();
                var otpExpiry = DateTime.UtcNow.AddMinutes(10); // OTP có hiệu lực 10 phút

                // Tạo user mới (chưa xác thực email)
                var user = new User
                {
                    UserName = dto.UserName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    IsEmailVerified = false,
                    OtpCode = otpCode,
                    OtpExpiry = otpExpiry,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Gửi email OTP
                var emailSent = await _emailService.SendOtpEmailAsync(dto.Email, otpCode);
                if (!emailSent)
                {
                    _logger.LogWarning($"Không thể gửi email OTP đến {dto.Email}");
                    // Vẫn trả về thành công nhưng cảnh báo
                }

                return Ok(new 
                { 
                    message = "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực.",
                    userId = user.Id,
                    emailSent = emailSent
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đăng ký tài khoản");
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau." });
            }
        }

        // POST: api/auth/verify-otp
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email không tồn tại trong hệ thống" });
            }

            if (user.IsEmailVerified)
            {
                return BadRequest(new { message = "Email đã được xác thực trước đó" });
            }

            if (string.IsNullOrEmpty(user.OtpCode) || !user.OtpExpiry.HasValue)
            {
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại." });
            }

            // Xác thực OTP
            if (!_otpService.VerifyOtp(user.OtpCode, dto.OtpCode, user.OtpExpiry))
            {
                return BadRequest(new { message = "Mã OTP không đúng hoặc đã hết hạn" });
            }

            // Cập nhật trạng thái xác thực
            user.IsEmailVerified = true;
            user.OtpCode = null;
            user.OtpExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ." });
        }

        // POST: api/auth/resend-otp
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email không tồn tại trong hệ thống" });
            }

            if (user.IsEmailVerified)
            {
                return BadRequest(new { message = "Email đã được xác thực" });
            }

            try
            {
                // Tạo mã OTP mới
                var otpCode = _otpService.GenerateOtp();
                var otpExpiry = DateTime.UtcNow.AddMinutes(10);

                user.OtpCode = otpCode;
                user.OtpExpiry = otpExpiry;

                await _context.SaveChangesAsync();

                // Gửi email OTP mới
                var emailSent = await _emailService.SendOtpEmailAsync(dto.Email, otpCode);
                if (!emailSent)
                {
                    return StatusCode(500, new { message = "Không thể gửi email. Vui lòng thử lại sau." });
                }

                return Ok(new { message = "Đã gửi lại mã OTP. Vui lòng kiểm tra email." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gửi lại OTP");
                return StatusCode(500, new { message = "Đã xảy ra lỗi. Vui lòng thử lại sau." });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == dto.UserName);
            if (user == null)
            {
                return Unauthorized(new { message = "Tên người dùng hoặc mật khẩu không đúng" });
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Tên người dùng hoặc mật khẩu không đúng" });
            }

            // Kiểm tra email đã được xác thực chưa
            if (!user.IsEmailVerified)
            {
                return Unauthorized(new 
                { 
                    message = "Tài khoản chưa được xác thực email. Vui lòng xác thực email trước khi đăng nhập.",
                    requiresVerification = true,
                    email = user.Email
                });
            }

            var token = GenerateJwtToken(user);
            return Ok(new 
            { 
                token,
                message = "Đăng nhập thành công",
                user = new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email
                }
            });
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult Logout()
        {
            // Với JWT, logout chủ yếu xảy ra ở phía client (xóa token)
            // Có thể thêm logic blacklist token nếu cần
            return Ok(new { message = "Đăng xuất thành công" });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(_config["Jwt:ExpireMinutes"]!)
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
