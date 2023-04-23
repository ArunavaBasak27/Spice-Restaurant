#nullable disable
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpiceAPI.Models
{
    public class OrderHeader
    {
        [Key]
        public int Id { get; set; }

        public string ApplicationUserId { get; set; }
        [ForeignKey(nameof(ApplicationUserId))]
        public ApplicationUser ApplicationUser { get; set; }


        public DateTime OrderDate { get; set; }


        [Required]
        public double OrderTotal { get; set; }

        [Required]
        public DateTime PickUpTime { get; set; }

        [Required]
        [NotMapped]
        public DateTime PickUpDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public int TotalItems { get; set; }

        public int CouponId { get; set; }
        [ForeignKey(name: nameof(CouponId))]
        public Coupon Coupon { get; set; }


        public string StripePaymentIntentID { get; set; }

    }
}
