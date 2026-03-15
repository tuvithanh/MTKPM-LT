namespace ConvenienceStoreAPI.Observer
{
    public interface IObserver
    {
        void Update(int userId, string message);
    }
}