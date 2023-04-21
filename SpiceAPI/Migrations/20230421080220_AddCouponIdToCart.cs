using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpiceAPI.Migrations
{
    public partial class AddCouponIdToCart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CouponId",
                table: "ShoppingCarts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCarts_CouponId",
                table: "ShoppingCarts",
                column: "CouponId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCarts_Coupons_CouponId",
                table: "ShoppingCarts",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCarts_Coupons_CouponId",
                table: "ShoppingCarts");

            migrationBuilder.DropIndex(
                name: "IX_ShoppingCarts_CouponId",
                table: "ShoppingCarts");

            migrationBuilder.DropColumn(
                name: "CouponId",
                table: "ShoppingCarts");
        }
    }
}
