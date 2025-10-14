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
        private readonly IConfiguration _config;

        public IdentitySeeder(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration config)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _config = config;
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
            var adminEmail = _config["AdminUser:Email"] ?? throw new Exception("Missing AdminUser:Email in configuration");
            var normalizedUsername = adminEmail.Trim().ToLowerInvariant();
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);
            var desiredPassword = _config["AdminUser:Password"] ?? throw new Exception("Missing AdminUser:Password in configuration");

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = normalizedUsername,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FirstName = "Admin",
                    LastName = "User",
                    SecurityQuestion = _config["AdminUser:SecurityQuestion"] ?? throw new Exception("Missing AdminUser:Security question in configuration")
                };
                var hasher = new PasswordHasher<ApplicationUser>();
                adminUser.SecurityAnswerHash = hasher.HashPassword(adminUser, _config["AdminUser:SecurityAnswer"] ?? throw new Exception("Missing AdminUser:Security Answer in configuration"));

                var createResult = await _userManager.CreateAsync(adminUser, desiredPassword);
                if (!createResult.Succeeded)
                    throw new Exception(string.Join(", ", createResult.Errors.Select(e => e.Description)));
            }
            else
            {
                if (string.IsNullOrWhiteSpace(adminUser.UserName))
                {
                    adminUser.UserName = normalizedUsername;
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