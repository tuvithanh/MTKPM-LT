using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Auth;
using ConvenienceStoreAPI.Helper;
using ConvenienceStoreAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ConvenienceStoreAPI.Infrastructure.AuthStrategies
{
    public class LocalAuthStrategy : IAuthStrategy
    {
        private readonly AppDbContext _context;
        public string ProviderName => "Local";

        public LocalAuthStrategy(AppDbContext context) => _context = context;

        public async Task<UserAccount?> AuthenticateAsync(LoginRequest request)
        {
            var account = await _context.UserAccounts
                .FirstOrDefaultAsync(a => a.Username == request.Username);

            if (account == null || !PasswordHelper.Verify(request.Password!, account.Password))
                return null;

            return account;
        }
    }
}
