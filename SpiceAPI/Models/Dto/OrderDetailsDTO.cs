using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class OrderDetailsDTO
    {

        [Required]
        public int MenuItemId { get; set; }
        [Required]
        public string ItemName { get; set; }
        [Required]
        public int Quantity { get; set; }

        [Required]
        public double Price { get; set; }
    }
}
