using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using SpiceAPI.Utility;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        IMapper _mapper;
        public OrderController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _response = new ApiResponse();
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<object> GetOrders(string? userId)
        {
            try
            {
                var orderHeaders = await _db.OrderHeaders.Include(u => u.OrderDetails)
                    .ThenInclude(u => u.MenuItem)
                    .OrderByDescending(u => u.Id)
                    .ToListAsync();

                if (!string.IsNullOrEmpty(userId))
                {
                    _response.Result = orderHeaders.Where(x => x.ApplicationUserId == userId).ToList();
                }
                else
                {
                    _response.Result = orderHeaders;
                }
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

        [HttpGet("{id:int}")]
        public async Task<object> GetOrders(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Order Not found");
                }

                var orderHeaders = await _db.OrderHeaders.Include(u => u.OrderDetails)
                    .ThenInclude(u => u.MenuItem)
                    .OrderByDescending(u => u.Id).Where(u => u.Id == id).ToListAsync();

                if (orderHeaders == null)
                {
                    throw new Exception("Orders not found");
                }

                _response.Result = orderHeaders;
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
        public async Task<object> CreateOrder([FromBody] OrderHeaderCreateDTO orderHeaderDTO)
        {
            try
            {
                OrderHeader orderHeader = _mapper.Map<OrderHeader>(orderHeaderDTO);
                orderHeader.OrderStatus = string.IsNullOrEmpty(orderHeaderDTO.OrderStatus) ? SD.StatusSubmitted : orderHeaderDTO.OrderStatus;
                orderHeader.PaymentStatus = string.IsNullOrEmpty(orderHeaderDTO.PaymentStatus) ? SD.PaymentStatusPending : orderHeaderDTO.PaymentStatus;
                orderHeader.CouponId = orderHeaderDTO.CouponId == 0 ? null : orderHeaderDTO.CouponId;
                orderHeader.OrderDate = DateTime.Now;
                if (orderHeader.CouponId != null)
                {
                    var couponFromDb = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == orderHeader.CouponId);
                    if (couponFromDb != null)
                    {
                        orderHeader.OrderTotal = SD.DiscountedPrice(couponFromDb, orderHeaderDTO.OrderTotal);
                    }
                }

                if (ModelState.IsValid)
                {
                    _db.OrderHeaders.Add(orderHeader);
                    await _db.SaveChangesAsync();

                    foreach (var orderDetailDTO in orderHeaderDTO.OrderDetails)
                    {
                        OrderDetails orderDetails = _mapper.Map<OrderDetails>(orderDetailDTO);
                        orderDetails.OrderHeaderId = orderHeader.Id;
                        _db.OrderDetails.Add(orderDetails);
                    }
                    await _db.SaveChangesAsync();
                }
                _response.Result = orderHeader;
                orderHeader.OrderDetails = null;
                _response.StatusCode = HttpStatusCode.Created;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }


        [HttpPut("{id:int}")]
        public async Task<object> UpdateOrder(int id, [FromBody] OrderHeaderUpdateDTO orderHeaderUpdateDTO)
        {
            try
            {
                if (orderHeaderUpdateDTO == null || id != orderHeaderUpdateDTO.Id)
                {
                    throw new Exception("Invalid order");
                }

                OrderHeader orderHeaderFromDb = await _db.OrderHeaders.FirstOrDefaultAsync(x => x.Id == id);

                if (orderHeaderFromDb == null)
                {
                    throw new Exception("Order not found");
                }

                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PickUpName))
                {
                    orderHeaderFromDb.PickUpName = orderHeaderUpdateDTO.PickUpName;
                }

                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PickUpPhone))
                {
                    orderHeaderFromDb.PickUpPhone = orderHeaderUpdateDTO.PickUpPhone;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.OrderStatus))
                {
                    orderHeaderFromDb.OrderStatus = orderHeaderUpdateDTO.OrderStatus;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.PaymentStatus))
                {
                    orderHeaderFromDb.PaymentStatus = orderHeaderUpdateDTO.PaymentStatus;
                }
                if (!string.IsNullOrEmpty(orderHeaderUpdateDTO.StripePaymentIntentID))
                {
                    orderHeaderFromDb.StripePaymentIntentID = orderHeaderUpdateDTO.StripePaymentIntentID;
                }
                await _db.SaveChangesAsync();

                _response.StatusCode = HttpStatusCode.NoContent;
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
