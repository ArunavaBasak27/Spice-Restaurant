using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _response;
        public ShoppingCartController(ApplicationDbContext db)
        {
            _db = db;
            _response = new ApiResponse();
        }
        [HttpGet]
        public async Task<object> GetShoppingCart(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    throw new Exception("User not found");
                }
                var shoppingCart = await _db.ShoppingCarts
                    .Include(x => x.CartItems)
                    .ThenInclude(x => x.MenuItem)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

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

        [HttpPost]
        public async Task<object> AddOrUpdateItemInCart(string userId, int menuItemId, int updateQuantityBy)
        {
            try
            {
                var shoppingCart = await _db.ShoppingCarts.Include(x => x.CartItems).ThenInclude(x => x.MenuItem).FirstOrDefaultAsync(x => x.UserId == userId);
                var menuItem = await _db.MenuItems.FirstOrDefaultAsync(u => u.Id == menuItemId);
                if (menuItem == null)
                {
                    throw new Exception("Menu Item not found");
                }

                if (shoppingCart == null && updateQuantityBy > 0)
                {
                    var newCart = new ShoppingCart
                    {
                        UserId = userId,
                    };

                    _db.ShoppingCarts.Add(newCart);
                    await _db.SaveChangesAsync();

                    var cartItem = new CartItem
                    {
                        MenuItemId = menuItemId,
                        Quantity = updateQuantityBy,
                        ShoppingCartId = newCart.Id,
                        MenuItem = null
                    };

                    _db.CartItems.Add(cartItem);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    var cartItemInCart = shoppingCart.CartItems.FirstOrDefault(u => u.MenuItemId == menuItemId);
                    if (cartItemInCart == null)
                    {
                        CartItem newCartItem = new()
                        {
                            MenuItemId = menuItemId,
                            Quantity = updateQuantityBy,
                            ShoppingCartId = shoppingCart.Id,
                            MenuItem = null
                        };
                        _db.CartItems.Add(newCartItem);
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        int newQuantity = cartItemInCart.Quantity + updateQuantityBy;
                        if (newQuantity <= 0 || updateQuantityBy == 0)
                        {
                            _db.CartItems.Remove(cartItemInCart);
                            if (shoppingCart.CartItems.Count() == 1)
                            {
                                _db.ShoppingCarts.Remove(shoppingCart);
                            }
                            await _db.SaveChangesAsync();
                        }
                        else
                        {
                            cartItemInCart.Quantity = newQuantity;
                            await _db.SaveChangesAsync();
                        }
                    }
                }
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
