using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskmasterpro.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedToUserRolesView : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR ALTER VIEW dbo.vw_UserRoles AS
                SELECT 
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.IsDeleted,
                    STRING_AGG(r.Name, ', ') WITHIN GROUP (
                        ORDER BY CASE r.Name
                            WHEN 'Admin' THEN 1
                            WHEN 'User' THEN 2
                            ELSE 99
                        END
                    ) AS Roles,
                    /* numeric priority used for ordering (1 = Admin, 2 = User, 99 = other) */
                    MIN(CASE r.Name
                            WHEN 'Admin' THEN 1
                            WHEN 'User' THEN 2
                            ELSE 99
                        END) AS HighestRolePriority,
                    /* number of roles per user */
                    COUNT(r.Name) AS RoleCount
                FROM dbo.AspNetUsers AS u
                LEFT JOIN dbo.AspNetUserRoles AS ur ON ur.UserId = u.Id
                LEFT JOIN dbo.AspNetRoles AS r ON ur.RoleId = r.Id
                GROUP BY u.Id, u.Email, u.FirstName, u.LastName, u.IsDeleted;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR ALTER VIEW dbo.vw_UserRoles AS
                SELECT 
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    STRING_AGG(r.Name, ', ') WITHIN GROUP (
                        ORDER BY CASE r.Name
                            WHEN 'Admin' THEN 1
                            WHEN 'User' THEN 2
                            ELSE 99
                        END
                    ) AS Roles,
                    /* numeric priority used for ordering (1 = Admin, 2 = User, 99 = other) */
                    MIN(CASE r.Name
                            WHEN 'Admin' THEN 1
                            WHEN 'User' THEN 2
                            ELSE 99
                        END) AS HighestRolePriority,
                    /* number of roles per user */
                    COUNT(r.Name) AS RoleCount
                FROM dbo.AspNetUsers AS u
                LEFT JOIN dbo.AspNetUserRoles AS ur ON ur.UserId = u.Id
                LEFT JOIN dbo.AspNetRoles AS r ON ur.RoleId = r.Id
                GROUP BY u.Id, u.Email, u.FirstName, u.LastName;
            ");
        }
    }
}
