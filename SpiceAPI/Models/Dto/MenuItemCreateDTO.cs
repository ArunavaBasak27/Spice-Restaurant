using System.ComponentModel.DataAnnotations;
using static SpiceAPI.Models.MenuItem;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class MenuItemCreateDTO
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        public ESpicy Spicyness { get; set; } = ESpicy.NA;

        public IFormFile File { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int SubCategoryId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Price should be greater than $1")]
        public double Price { get; set; }
    }
}