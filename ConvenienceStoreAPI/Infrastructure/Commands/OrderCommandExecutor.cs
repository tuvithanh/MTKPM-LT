namespace ConvenienceStoreAPI.Infrastructure.Commands
{
    public class OrderCommandExecutor
    {
        private readonly Queue<ICommand> _commandQueue = new Queue<ICommand>();

        public async Task ExecuteAsync(ICommand command)
        {
            _commandQueue.Enqueue(command);
            await command.ExecuteAsync();
        }

        public Queue<ICommand> GetCommandHistory() => _commandQueue;
    }
}