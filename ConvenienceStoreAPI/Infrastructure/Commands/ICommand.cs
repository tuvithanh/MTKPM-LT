namespace ConvenienceStoreAPI.Infrastructure.Commands
{
    public interface ICommand
    {
        Task ExecuteAsync();
    }
}