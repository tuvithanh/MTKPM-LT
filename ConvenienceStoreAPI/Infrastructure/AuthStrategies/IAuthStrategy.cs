using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.Models;
using ConvenienceStoreAPI.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using ConvenienceStoreAPI.Helper;

namespace ConvenienceStoreAPI.Infrastructure.AuthStrategies
{
    public interface IAuthStrategy
    {
        string ProviderName { get; }
        Task<UserAccount?> AuthenticateAsync(LoginRequest request);
    }
}
