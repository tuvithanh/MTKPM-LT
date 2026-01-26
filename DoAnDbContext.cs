using Do_an.Models;
using Microsoft.EntityFrameworkCore;
namespace Do_an.Data
{
    public class DoAnDbContext : DbContext
    {
        public DoAnDbContext(DbContextOptions<DoAnDbContext>options) : base (options) { }
        public DbSet<User> Users => Set<User>();
    }
}
    