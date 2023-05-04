using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
    [Authorize]
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
        public async Task<object> GetOrders(string userId = null, int pageNumber = 1, int pageSize = 5, string status = null
            ,string name=null,string phoneNumber = null,string email = null)
        {
            try
            {
                var orderHeaders = await _db.OrderHeaders.Include(u => u.ApplicationUser).Include(u => u.Coupon)
                    .Include(u => u.OrderDetails)
                    .ThenInclude(u => u.MenuItem)
                    .OrderByDescending(u => u.Id)
                    .ToListAsync();

                if (!string.IsNullOrEmpty(name))
                {
                    orderHeaders = orderHeaders.Where(x => x.ApplicationUser.Name.ToLower().Contains(name.ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(email))
                {
                    orderHeaders = orderHeaders.Where(x => x.ApplicationUser.Email.ToLower().Contains(email.ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(phoneNumber))
                {
                    orderHeaders = orderHeaders.Where(x => x.ApplicationUser.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())).ToList();
                }

                if (!string.IsNullOrEmpty(status))
                {
                    orderHeaders = orderHeaders.Where(x => x.OrderStatus == status).ToList();
                }

                if (!string.IsNullOrEmpty(userId))
                {
                    orderHeaders = orderHeaders.Where(x => x.ApplicationUserId == userId).ToList();
                }

                Pagination pagination = new Pagination()
                {
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalRecords = orderHeaders.Count()
                };

                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(pagination));

                _response.Result = orderHeaders.Skip((pageNumber - 1) * pageSize).Take(pageSize);
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
                orderHeader.PickUpTime = orderHeaderDTO.PickUpTime;
                orderHeader.Comment = orderHeaderDTO.Comment;
                orderHeader.StripePaymentIntentID = orderHeaderDTO.StripePaymentIntentId;
                if (orderHeader.CouponId != null)
                {
                    var couponFromDb = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == orderHeader.CouponId);
                    if (couponFromDb != null)
                    {
                        orderHeader.OrderTotal = SD.DiscountedPrice(couponFromDb, orderHeaderDTO.OrderTotal);
                    }
                }
                else
                {
                    orderHeader.OrderTotal = orderHeaderDTO.OrderTotal;
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
