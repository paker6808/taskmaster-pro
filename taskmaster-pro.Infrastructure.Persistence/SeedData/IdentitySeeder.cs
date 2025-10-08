using Microsoft.AspNetCore.Identity;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;

namespace taskmaster_pro.Infrastructure.Persistence.SeedData
{
    /// <summary>
    /// class for seeding identity data, such as an admin user.
    /// </summary>
    public class IdentitySeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentitySeeder(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        /// <summary>
        /// Seeds an admin user and role into the identity system.
        /// </summary>
        public async Task SeedAsync()
        {
            // 1. Seed roles
            string[] roles = new[] { "Admin", "User" };
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Seed admin user
            var adminEmail = "admin@example.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);
            var desiredPassword = "AdminPass123!";

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FirstName = "Admin",
                    LastName = "User",
                    SecurityQuestion = "What is your admin code?",
                };
                var hasher = new PasswordHasher<ApplicationUser>();
                adminUser.SecurityAnswerHash = hasher.HashPassword(adminUser, "admin123");

                var createResult = await _userManager.CreateAsync(adminUser, desiredPassword);
                if (!createResult.Succeeded)
                    throw new Exception(string.Join(", ", createResult.Errors.Select(e => e.Description)));
            }
            else
            {
                if (string.IsNullOrWhiteSpace(adminUser.UserName))
                {
                    adminUser.UserName = "admin";
                    await _userManager.UpdateAsync(adminUser);
                }
                if (!adminUser.EmailConfirmed)
                {
                    var t = await _userManager.GenerateEmailConfirmationTokenAsync(adminUser);
                    await _userManager.ConfirmEmailAsync(adminUser, t);
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(adminUser);
                var reset = await _userManager.ResetPasswordAsync(adminUser, token, desiredPassword);
                if (!reset.Succeeded)
                    throw new Exception("Admin password reset failed: " + string.Join(", ", reset.Errors.Select(e => e.Description)));

                await _userManager.SetLockoutEndDateAsync(adminUser, null);
                await _userManager.ResetAccessFailedCountAsync(adminUser);
            }

            // 3) Ensure role
            if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
                await _userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}