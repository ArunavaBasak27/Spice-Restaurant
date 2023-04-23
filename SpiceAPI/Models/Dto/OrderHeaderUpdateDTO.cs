using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class OrderHeaderUpdateDTO
    {
        public int Id { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public string PickUpName { get; set; }
        public string PickUpPhone { get; set; }
        public string StripePaymentIntentID { get; set; }
    }
}
