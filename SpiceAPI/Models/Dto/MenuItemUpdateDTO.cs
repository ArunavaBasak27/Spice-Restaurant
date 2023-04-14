using System.ComponentModel.DataAnnotations;
using static SpiceAPI.Models.MenuItem;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class MenuItemUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public ESpicy Spicyness { get; set; } = ESpicy.NA;

        public IFormFile File { get; set; }

        public int CategoryId { get; set; }

        public int SubCategoryId { get; set; }

        public double Price { get; set; }
    }
}