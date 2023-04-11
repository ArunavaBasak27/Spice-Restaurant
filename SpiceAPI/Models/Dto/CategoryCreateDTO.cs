using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class CategoryCreateDTO
    {
        [Required]
        public string Name { get; set; }
    }
}
