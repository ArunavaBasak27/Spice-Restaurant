using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpiceAPI.Migrations
{
    public partial class makeCouponNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderHeaders_Coupons_CouponId",
                table: "OrderHeaders");

            migrationBuilder.AlterColumn<int>(
                name: "CouponId",
                table: "OrderHeaders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderHeaders_Coupons_CouponId",
                table: "OrderHeaders",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderHeaders_Coupons_CouponId",
                table: "OrderHeaders");

            migrationBuilder.AlterColumn<int>(
                name: "CouponId",
                table: "OrderHeaders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderHeaders_Coupons_CouponId",
                table: "OrderHeaders",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
