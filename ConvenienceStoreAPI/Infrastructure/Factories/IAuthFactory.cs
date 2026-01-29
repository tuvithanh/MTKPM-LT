using ConvenienceStoreAPI.Infrastructure.AuthStrategies;

namespace ConvenienceStoreAPI.Infrastructure.Factories
{
    public interface IAuthFactory
    {
        IAuthStrategy GetStrategy(string provider);
    }
}
