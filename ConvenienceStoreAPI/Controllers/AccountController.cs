using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Auth;
using ConvenienceStoreAPI.Helper;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace ConvenienceStoreAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/accounts/user/5 - Lấy thông tin tài khoản của user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<UserAccount>> GetAccountByUserId(int userId)
        {
            var account = await _context.UserAccounts
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (account == null)
            {
                return NotFound("User chưa có tài khoản");
            }

            return Ok(account);
        }

        // POST: api/accounts - Cấp tài khoản cho user
        [HttpPost]
        public async Task<ActionResult<UserAccount>> CreateAccount(UserAccount account)
        {
            // Kiểm tra user có tồn tại không
            var userExists = await _context.Users.AnyAsync(u => u.Id == account.UserId);
            if (!userExists)
            {
                return BadRequest("User không tồn tại");
            }

            // Kiểm tra user đã có tài khoản chưa
            var hasAccount = await _context.UserAccounts.AnyAsync(a => a.UserId == account.UserId);
            if (hasAccount)
            {
                return BadRequest("User đã có tài khoản");
            }

            // Kiểm tra username đã tồn tại chưa
            var usernameExists = await _context.UserAccounts.AnyAsync(a => a.Username == account.Username);
            if (usernameExists)
            {
                return BadRequest("Username đã tồn tại");
            }

            account.CreatedAt = DateTime.Now;
            account.IsActive = true;

            _context.UserAccounts.Add(account);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccountByUserId), new { userId = account.UserId }, account);
        }

        // PUT: api/accounts/5 - Cập nhật tài khoản
        [HttpPut("{id}")]
        public async Task<ActionResult<UserAccount>> UpdateAccount(int id, UserAccount updatedAccount)
        {
            var account = await _context.UserAccounts.FindAsync(id);

            if (account == null)
            {
                return NotFound("Không tìm thấy tài khoản");
            }

            // Kiểm tra username mới có trùng với account khác không
            if (updatedAccount.Username != account.Username)
            {
                var usernameExists = await _context.UserAccounts
                    .AnyAsync(a => a.Username == updatedAccount.Username && a.Id != id);
                if (usernameExists)
                {
                    return BadRequest("Username đã tồn tại");
                }
            }

            // Cập nhật thông tin
            account.Username = updatedAccount.Username;
            account.Password = updatedAccount.Password;
            account.Role = updatedAccount.Role;
            account.IsActive = updatedAccount.IsActive;

            await _context.SaveChangesAsync();

            return Ok(account);
        }

        // DELETE: api/accounts/5 - Xóa tài khoản
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAccount(int id)
        {
            var account = await _context.UserAccounts.FindAsync(id);

            if (account == null)
            {
                return NotFound("Không tìm thấy tài khoản");
            }

            _context.UserAccounts.Remove(account);
            await _context.SaveChangesAsync();

            return Ok("Xóa tài khoản thành công");
        }

        // POST: api/Account/create-admin-simple
        [HttpPost("create-admin-simple")]
        public async Task<IActionResult> CreateAdminSimple([FromBody] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Tên không được để trống.");
            }

            // 1. Cấu hình mặc định
            string defaultUsername = "admin_" + name.Replace(" ", "").ToLower();
            string defaultPassword = "admin@123";
            string adminRole = "ADMIN";

            // 2. Kiểm tra trùng Username
            if (await _context.UserAccounts.AnyAsync(a => a.Username == defaultUsername))
            {
                defaultUsername += new Random().Next(10, 99).ToString();
            }

            // 3. Sử dụng Transaction để đảm bảo an toàn dữ liệu
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Tạo User
                var user = new User
                {
                    Name = name,
                    CreatedAt = DateTime.Now
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Tạo Account
                var account = new UserAccount
                {
                    UserId = user.Id,
                    Username = defaultUsername,
                    // Sử dụng PasswordHelper.Hash như bạn đã có trong dự án
                    Password = PasswordHelper.Hash(defaultPassword),
                    Role = adminRole,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                };

                _context.UserAccounts.Add(account);
                await _context.SaveChangesAsync();

                // Hoàn tất lưu dữ liệu
                await transaction.CommitAsync();

                return Ok(new
                {
                    Status = "Success",
                    Message = "Tạo tài khoản Admin thành công",
                    Data = new
                    {
                        Username = defaultUsername,
                        PasswordDefault = defaultPassword,
                        Role = adminRole
                    }
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}