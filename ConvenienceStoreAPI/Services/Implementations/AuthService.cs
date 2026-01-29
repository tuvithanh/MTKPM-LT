using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Auth;
using ConvenienceStoreAPI.Helper;
using ConvenienceStoreAPI.Infrastructure.Factories;
using ConvenienceStoreAPI.Models;
using ConvenienceStoreAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ConvenienceStoreAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IAuthFactory _authFactory;

        public AuthService(AppDbContext context, IConfiguration config, IAuthFactory authFactory)
        {
            _context = context; _config = config; _authFactory = authFactory;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {

            var finalRole = string.IsNullOrWhiteSpace(request.Role) ? "CUSTOMER" : request.Role;
            // 1. Kiểm tra username trùng lặp
            if (await _context.UserAccounts.AnyAsync(a => a.Username == request.Username))
                throw new Exception("Username đã tồn tại.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 2. Tạo thông tin User
                var user = new User
                {
                    Name = request.Name,
                    CreatedAt = DateTime.Now
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // 3. Tạo tài khoản đăng nhập
                var account = new UserAccount
                {
                    UserId = user.Id,
                    Username = request.Username,
                    Password = PasswordHelper.Hash(request.Password), // BCrypt
                    Role = finalRole,
                    CreatedAt = DateTime.Now
                };
                _context.UserAccounts.Add(account);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // 4. Trả về DTO thay vì Entity để tránh lỗi vòng lặp JSON
                // Đồng thời generate luôn token để user không cần login lại sau khi reg
                return new AuthResponse
                {
                    Username = account.Username,
                    Token = GenerateJwtToken(account) // Gọi hàm tạo Token của bạn
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var strategy = _authFactory.GetStrategy(request.Provider);
            var account = await strategy.AuthenticateAsync(request);

            if (account == null) throw new UnauthorizedAccessException("Sai tài khoản hoặc mật khẩu.");

            return new AuthResponse
            {
                Username = account.Username,
                Token = GenerateJwtToken(account),
                Role = account.Role,
            };
        }

        public async Task<bool> ChangePasswordAsync(ChangePasswordRequest request)
        {
            var account = await _context.UserAccounts.FirstOrDefaultAsync(a => a.UserId == request.UserId);
            if (account == null || !PasswordHelper.Verify(request.OldPassword, account.Password))
                return false;

            account.Password = PasswordHelper.Hash(request.NewPassword);
            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateJwtToken(UserAccount account)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, account.UserId.ToString()),
            new Claim(ClaimTypes.Name, account.Username),
            new Claim(ClaimTypes.Role, account.Role)
        };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"], _config["Jwt:Audience"], claims,
                expires: DateTime.Now.AddHours(3), signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
