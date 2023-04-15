using System.ComponentModel.DataAnnotations;
using static SpiceAPI.Models.Coupon;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class CouponUpdateDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ECouponType CouponType { get; set; } 


        public double Discount { get; set; }

        public double MinimumAmount { get; set; }
        public IFormFile File { get; set; }

        public bool IsActive { get; set; }
    }
}
