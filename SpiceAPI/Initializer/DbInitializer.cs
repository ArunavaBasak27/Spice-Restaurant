using Microsoft.AspNetCore.Identity;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Utility;

namespace SpiceAPI.Initializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public DbInitializer(ApplicationDbContext db, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public void Initialize()
        {
            if (_roleManager.FindByNameAsync(SD.AdminUser).GetAwaiter().GetResult() == null)
            {
                _roleManager.CreateAsync(new IdentityRole(SD.AdminUser)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.CustomerUser)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.ManagerUser)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.FrontDeskUser)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.KitchenUser)).GetAwaiter().GetResult();

                ApplicationUser adminUser = new()
                {
                    UserName = "admin@gmail.com",
                    Name = "Admin Ben",
                    Email = "admin@gmail.com",
                    PhoneNumber = "1111111111",
                    City = "Unknown City",
                    State = "Unknown State",
                    PostalCode = "1000000"
                };

                _userManager.CreateAsync(adminUser, "Admin123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(adminUser, SD.AdminUser).GetAwaiter().GetResult();

                ApplicationUser kitchenUser = new()
                {
                    UserName = "kitchen@gmail.com",
                    Name = "Kitchen Jim",
                    Email = "kitchen@gmail.com",
                    PhoneNumber = "1111111111",
                    City = "Unknown City",
                    State = "Unknown State",
                    PostalCode = "1000000"
                };

                _userManager.CreateAsync(kitchenUser, "Kitchen123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(kitchenUser, SD.KitchenUser).GetAwaiter().GetResult();

                ApplicationUser customerUser = new()
                {
                    UserName = "customer@gmail.com",
                    Name = "Customer Ben",
                    Email = "customer@gmail.com",
                    PhoneNumber = "1111111111",
                    City = "Unknown City",
                    State = "Unknown State",
                    PostalCode = "1000000"
                };

                _userManager.CreateAsync(customerUser, "Customer123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(customerUser, SD.CustomerUser).GetAwaiter().GetResult();

                ApplicationUser ManagerUser = new()
                {
                    UserName = "Manager@gmail.com",
                    Name = "Manager Park",
                    Email = "Manager@gmail.com",
                    PhoneNumber = "1111111111",
                    City = "Unknown City",
                    State = "Unknown State",
                    PostalCode = "1000000"
                };

                _userManager.CreateAsync(ManagerUser, "Manager123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(ManagerUser, SD.ManagerUser).GetAwaiter().GetResult();

                ApplicationUser frontDeskUser = new()
                {
                    UserName = "frontDesk@gmail.com",
                    Name = "FrontDesk Ben",
                    Email = "frontDesk@gmail.com",
                    PhoneNumber = "1111111111",
                    City = "Unknown City",
                    State = "Unknown State",
                    PostalCode = "1000000"
                };

                _userManager.CreateAsync(frontDeskUser, "FrontDesk123*").GetAwaiter().GetResult();
                _userManager.AddToRoleAsync(frontDeskUser, SD.FrontDeskUser).GetAwaiter().GetResult();
            }

          
        }
    }
}
