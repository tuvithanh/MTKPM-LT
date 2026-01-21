using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConvenienceStoreAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users - Lấy danh sách tất cả users
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Account) // Lấy cả thông tin Account
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/5 - Lấy thông tin 1 user theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Account)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Không tìm thấy user");
            }

            return Ok(user);
        }

        // POST: api/users - Tạo user mới
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            user.CreatedAt = DateTime.Now;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/users/5 - Cập nhật thông tin user
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Không tìm thấy user");
            }

            // Cập nhật thông tin
            user.AvatarUrl = updatedUser.AvatarUrl;
            user.Name = updatedUser.Name;
            user.Age = updatedUser.Age;
            user.Gender = updatedUser.Gender;
            user.Address = updatedUser.Address;
            user.Tele = updatedUser.Tele;

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // DELETE: api/users/5 - Xóa user
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Không tìm thấy user");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Xóa user thành công");
        }
    }
}