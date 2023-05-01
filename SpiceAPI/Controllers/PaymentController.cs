using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Utility;
using Stripe;
using System.Net;

namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _response;
        private readonly IConfiguration _configuration;
        public PaymentController(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _response = new ApiResponse();
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<object> MakePayment(string userId)
        {
            try
            {
                var shoppingCart = await _db.ShoppingCarts.Include(x => x.Coupon)
                    .Include(x => x.ApplicationUser)
                    .Include(x => x.CartItems).ThenInclude(x => x.MenuItem).FirstOrDefaultAsync(u => u.UserId == userId);
                if (shoppingCart == null || shoppingCart.CartItems == null || shoppingCart.CartItems.Count() == 0)
                {
                    throw new Exception("Shopping cart is empty");
                }

                #region Create Payment Intent

                StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
                double cartTotal = shoppingCart.CartItems.Sum(x => x.Quantity * x.MenuItem.Price);

                if (shoppingCart.Coupon != null)
                {
                    cartTotal = SD.DiscountedPrice(shoppingCart.Coupon, cartTotal);
                }

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (int)(cartTotal * 100),
                    Currency = "usd",
                    Description = "Test Description",
                    Shipping = new ChargeShippingOptions
                    {
                        Name = shoppingCart.ApplicationUser.Name,
                        Address = new AddressOptions
                        {
                            Line1 = shoppingCart.ApplicationUser.StreetAddress,
                            PostalCode = shoppingCart.ApplicationUser.PostalCode,
                            City = shoppingCart.ApplicationUser.City,
                            State = shoppingCart.ApplicationUser.State,
                            Country = "US",
                        },
                    },
                    PaymentMethodTypes = new List<string>
                    {
                        "card"
                    }
                };
                var service = new PaymentIntentService();
                var response = service.Create(options);

                shoppingCart.StripePaymentIntentId = response.Id;
                shoppingCart.ClientSecret = response.ClientSecret;
                shoppingCart.CartTotal = cartTotal;



                #endregion
                _response.Result = shoppingCart;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }

        [HttpPost("{id:int}")]
        public async Task<object> RefundPayment(int id)
        {
            try
            {
                StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];

                var orderFromDb = await _db.OrderHeaders.FirstOrDefaultAsync(x => x.Id == id);

                if (orderFromDb == null)
                {
                    throw new Exception("Refund not possible!");
                }

                var paymentIntent = orderFromDb.StripePaymentIntentID;

                var options = new RefundCreateOptions
                {
                    PaymentIntent = paymentIntent,
                    Amount = (int)(orderFromDb.OrderTotal * 100),
                };
                var service = new RefundService();
                var response = service.Create(options);
                _response.Result = response;
                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }
    }
}
