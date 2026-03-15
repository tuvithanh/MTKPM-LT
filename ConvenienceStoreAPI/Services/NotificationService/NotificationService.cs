using ConvenienceStoreAPI.Observer;

namespace ConvenienceStoreAPI.Services
{
    public class NotificationService
    {
        private readonly NotificationSubject _subject;

        public NotificationService()
        {
            _subject = new NotificationSubject();
            _subject.Attach(new NotificationLogger());
        }

        public void NotifyLogin(int userId)
        {
            _subject.Notify(userId, "Login successful");
        }

        public void NotifyAddToCart(int userId)
        {
            _subject.Notify(userId, "Added product to cart successfully");
        }
    }
}