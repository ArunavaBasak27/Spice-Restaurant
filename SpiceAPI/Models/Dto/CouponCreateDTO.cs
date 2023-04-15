using System.ComponentModel.DataAnnotations;
using static SpiceAPI.Models.Coupon;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class CouponCreateDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public ECouponType CouponType { get; set; }

        [Required]
        public double Discount { get; set; }

        [Required]
        public double MinimumAmount { get; set; }
        [Required]
        public IFormFile File { get; set; }

        public bool IsActive { get; set; } = false;
    }
}
