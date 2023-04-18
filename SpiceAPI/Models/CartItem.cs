using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
#nullable disable
namespace SpiceAPI.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("MenuItemId")]
        public int MenuItemId { get; set; }
        public MenuItem MenuItem { get; set; }
        public int Quantity { get; set; }
        public int  ShoppingCartId { get; set; }

    }
}
