using System;

namespace ConvenienceStoreAPI.Observer
{
    public class NotificationLogger : IObserver
    {
        public void Update(int userId, string message)
        {
            Console.WriteLine($"User {userId}: {message}");
        }
    }
}