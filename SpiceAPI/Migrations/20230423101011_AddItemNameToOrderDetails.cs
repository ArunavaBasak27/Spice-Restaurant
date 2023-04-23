using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpiceAPI.Migrations
{
    public partial class AddItemNameToOrderDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ItemName",
                table: "OrderDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemName",
                table: "OrderDetails");
        }
    }
}
