namespace ConvenienceStoreAPI.Observer
{
    public interface ISubject
    {
        void Attach(IObserver observer);
        void Detach(IObserver observer);
        void Notify(int userId, string message);
    }
}