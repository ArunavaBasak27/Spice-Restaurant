#nullable disable
using System.ComponentModel.DataAnnotations;

namespace SpiceAPI.Models.Dto
{
    public class RegisterRequestDTO
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare(nameof(Password), ErrorMessage = "Password & confirm password do not match")]
        public string ConfirmPassword { get; set; }
        public string Role { get; set; }
    }
}
