using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskmasterpro.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSecurityQuestionAndAnswerToAspNetUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecurityAnswerHash",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecurityQuestion",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SecurityAnswerHash",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SecurityQuestion",
                table: "AspNetUsers");
        }
    }
}
