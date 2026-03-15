using System.Collections.Generic;

namespace ConvenienceStoreAPI.Observer
{
    public class NotificationSubject : ISubject
    {
        private readonly List<IObserver> _observers = new();

        public void Attach(IObserver observer)
        {
            _observers.Add(observer);
        }

        public void Detach(IObserver observer)
        {
            _observers.Remove(observer);
        }

        public void Notify(int userId, string message)
        {
            foreach (var observer in _observers)
            {
                observer.Update(userId, message);
            }

            // lưu notification vào store
            NotificationStore.Notifications.Add(message);
        }
    }
}