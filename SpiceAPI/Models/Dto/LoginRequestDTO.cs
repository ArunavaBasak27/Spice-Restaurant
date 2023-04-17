#nullable disable
using System.ComponentModel.DataAnnotations;

namespace SpiceAPI.Models.Dto
{
    public class LoginRequestDTO
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
