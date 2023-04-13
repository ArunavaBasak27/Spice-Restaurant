using System.ComponentModel.DataAnnotations;
#nullable disable
namespace SpiceAPI.Models.Dto
{
    public class SubCategoryUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
    }
}
