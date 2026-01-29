using ConvenienceStoreAPI.Infrastructure.AuthStrategies;

namespace ConvenienceStoreAPI.Infrastructure.Factories
{
    public class AuthFactory : IAuthFactory
    {
        private readonly IEnumerable<IAuthStrategy> _strategies;
        public AuthFactory(IEnumerable<IAuthStrategy> strategies) => _strategies = strategies;

        public IAuthStrategy GetStrategy(string provider) =>
            _strategies.FirstOrDefault(s => s.ProviderName.Equals(provider, StringComparison.OrdinalIgnoreCase))
            ?? throw new Exception("Phương thức đăng nhập không được hỗ trợ.");
    }
}
