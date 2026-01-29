using ConvenienceStoreAPI.DTOs.Auth;
using ConvenienceStoreAPI.Models;

namespace ConvenienceStoreAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<bool> ChangePasswordAsync(ChangePasswordRequest request);
    }
}
