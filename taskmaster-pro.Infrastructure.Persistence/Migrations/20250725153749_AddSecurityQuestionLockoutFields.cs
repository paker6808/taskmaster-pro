using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskmasterpro.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSecurityQuestionLockoutFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FailedSecurityQuestionAttempts",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SecurityQuestionLockoutEnd",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FailedSecurityQuestionAttempts",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SecurityQuestionLockoutEnd",
                table: "AspNetUsers");
        }
    }
}
