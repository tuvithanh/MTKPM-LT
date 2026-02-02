using ConvenienceStoreAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;


namespace ConvenienceStoreAPI.Data
{
    // DbContext: Kết nối giữa code C# và database
    public class AppDbContext: DbContext

    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        
        public DbSet<User> Users { get; set; }

      
        public DbSet<UserAccount> UserAccounts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<PaymentLog> PaymentLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình mối quan hệ: 1 User có thể có 1 Account
            modelBuilder.Entity<User>()
                .HasOne(u => u.Account)
                .WithOne(a => a.User)
                .HasForeignKey<UserAccount>(a => a.UserId)
                .OnDelete(  DeleteBehavior.Cascade); // Xóa User → Xóa luôn Account

            // Username phải là duy nhất (không trùng lặp)
            modelBuilder.Entity<UserAccount>()
                .HasIndex(a => a.Username)
                .IsUnique();
        }
    }
}