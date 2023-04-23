using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class OrderHeaderCreateDTO
    {

        public string ApplicationUserId { get; set; }

        [Required]
        public double OrderTotal { get; set; }

        [Required]
        public DateTime PickUpTime { get; set; }

        [Required]
        public DateTime PickUpDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public int TotalItems { get; set; }

        public int CouponId { get; set; }

        [Required]
        public string PickUpName { get; set; }
        [Required]
        public string PickUpPhone { get; set; }

        public IEnumerable<OrderDetailsDTO> OrderDetails { get; set; }

    }
}
