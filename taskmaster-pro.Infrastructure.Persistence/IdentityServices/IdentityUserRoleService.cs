using Microsoft.AspNetCore.Identity;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;

namespace taskmaster_pro.Infrastructure.Persistence.IdentityServices
{
    public class IdentityUserRoleService : IUserRoleService
    {
        #region Fields

        private readonly UserManager<ApplicationUser> _userManager;

        #endregion

        #region Constructor

        public IdentityUserRoleService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        #endregion

        #region Public Methods

        public async Task UpdateRolesAsync(string userId, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new Exception($"User {userId} not found.");

            var currentRoles = (await _userManager.GetRolesAsync(user)).ToList();
            var rolesToAdd = roles.Except(currentRoles).ToList();
            var rolesToRemove = currentRoles.Except(roles).ToList();

            if (rolesToRemove.Contains("Admin"))
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                if (admins.Count == 1 && admins.First().Id == user.Id)
                    throw new InvalidOperationException("Cannot remove the last Admin.");
            }

            if (rolesToRemove.Any())
                await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

            if (rolesToAdd.Any())
                await _userManager.AddToRolesAsync(user, rolesToAdd);

            var finalRoles = await _userManager.GetRolesAsync(user);
            if (!finalRoles.Any())
                await _userManager.AddToRoleAsync(user, "User");
        }

        #endregion
    }
}
