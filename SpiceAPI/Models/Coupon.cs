using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models
{
    public class Coupon
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public ECouponType CouponType { get; set; } = ECouponType.Percent;
        public enum ECouponType { Percent = 0, Dollar = 1 };


        [Required]
        public double Discount { get; set; }

        [Required]
        public double MinimumAmount { get; set; }

        public byte[] Picture { get; set; }

        public bool IsActive { get; set; } = false;
    }
}
