using Microsoft.EntityFrameworkCore;
using SpiceAPI.Models;
#nullable disable

namespace SpiceAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }

    }
}
