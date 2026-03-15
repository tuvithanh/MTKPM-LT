using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.DTOs.Checkout;
using ConvenienceStoreAPI.Models;

namespace ConvenienceStoreAPI.Infrastructure.Commands
{
    public class CreateOrderCommand : ICommand
    {
        private readonly AppDbContext _db;
        private readonly CheckoutRequest _request;
        private Order _createdOrder;

        public CreateOrderCommand(AppDbContext db, CheckoutRequest request)
        {
            _db = db;
            _request = request;
        }

        public async Task ExecuteAsync()
        {
            _createdOrder = new Order
            {
                UserId = _request.UserId,
                TotalAmount = _request.Items.Sum(i => i.Price * i.Quantity),
                PaymentMethod = _request.PaymentMethod,
                OrderDate = DateTime.Now,
                Status = "Pending",
                OrderDetails = _request.Items.Select(i => new OrderDetail
                {
                    ProductId = i.Id,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _db.Orders.Add(_createdOrder);
            await _db.SaveChangesAsync();
        }

        public Order GetOrder() => _createdOrder;
    }
}