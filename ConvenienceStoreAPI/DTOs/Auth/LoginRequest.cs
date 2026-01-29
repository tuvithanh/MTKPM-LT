namespace ConvenienceStoreAPI.DTOs.Auth
{
    public class LoginRequest
    {
        public string Provider { get; set; } = "Local";
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
