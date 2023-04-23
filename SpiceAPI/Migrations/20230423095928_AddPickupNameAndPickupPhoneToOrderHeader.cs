using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpiceAPI.Migrations
{
    public partial class AddPickupNameAndPickupPhoneToOrderHeader : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PickUpName",
                table: "OrderHeaders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PickUpPhone",
                table: "OrderHeaders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PickUpName",
                table: "OrderHeaders");

            migrationBuilder.DropColumn(
                name: "PickUpPhone",
                table: "OrderHeaders");
        }
    }
}
