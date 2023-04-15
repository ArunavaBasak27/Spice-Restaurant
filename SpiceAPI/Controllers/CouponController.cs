using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        private readonly IMapper _mapper;
        public CouponController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _response = new ApiResponse();
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetCoupons()
        {
            try
            {
                var couponList = await _db.Coupons.ToListAsync();
                _response.Result = couponList;
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
        public async Task<IActionResult> GetCoupon(int id)
        {
            try
            {
                var coupon = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == id);
                _response.Result = coupon;
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
        public async Task<IActionResult> CreateCoupon([FromForm] CouponCreateDTO couponDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var couponFromDb = await _db.Coupons.FirstOrDefaultAsync(x => x.Name == couponDTO.Name);
                    if (couponFromDb != null)
                    {
                        throw new Exception("Coupon already exists");
                    }
                    var coupon = _mapper.Map<Coupon>(couponDTO);
                    if (couponDTO.File != null && couponDTO.File.Length > 0)
                    {
                        byte[] p1 = null;
                        var file = couponDTO.File;
                        using (var fs1 = file.OpenReadStream())
                        {
                            using (var ms1 = new MemoryStream())
                            {
                                fs1.CopyTo(ms1);
                                p1 = ms1.ToArray();
                            }
                        }
                        coupon.Picture = p1;
                    }
                    _db.Coupons.Add(coupon);
                    await _db.SaveChangesAsync();
                    _response.StatusCode = HttpStatusCode.Created;
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
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCoupon(int id, [FromForm] CouponUpdateDTO couponDTO)
        {
            try
            {
                if (id == 0 || id != couponDTO.Id)
                {
                    throw new Exception("Error while updating coupon");
                }

                Coupon coupon = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == id);
                if (couponDTO == null)
                {
                    throw new Exception("Coupon not found");
                }
                coupon.Name = couponDTO.Name;
                coupon.MinimumAmount = couponDTO.MinimumAmount;
                coupon.CouponType = couponDTO.CouponType;
                coupon.Discount = couponDTO.Discount;
                coupon.IsActive = couponDTO.IsActive;

                if (couponDTO.File != null && couponDTO.File.Length > 0)
                {
                    byte[] p1 = null;
                    var file = couponDTO.File;
                    using (var fs1 = file.OpenReadStream())
                    {
                        using (var ms1 = new MemoryStream())
                        {
                            fs1.CopyTo(ms1);
                            p1 = ms1.ToArray();
                        }
                    }
                    coupon.Picture = p1;
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
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Error while updating coupon");
                }
                Coupon coupon = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == id);
                if (coupon == null)
                {
                    throw new Exception("Coupon not found");
                }
                _db.Coupons.Remove(coupon);
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
