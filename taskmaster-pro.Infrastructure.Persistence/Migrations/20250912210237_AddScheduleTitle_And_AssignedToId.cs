using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskmasterpro.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduleTitle_And_AssignedToId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_AspNetUsers_UserId1",
                table: "Schedules");

            migrationBuilder.DropIndex(
                name: "IX_Schedules_UserId1",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Schedules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "Schedules",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_UserId1",
                table: "Schedules",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_AspNetUsers_UserId1",
                table: "Schedules",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
