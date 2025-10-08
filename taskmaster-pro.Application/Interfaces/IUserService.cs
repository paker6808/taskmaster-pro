using Features.Users.ViewModels;
using taskmaster_pro.Application.Features.Admin.Queries.GetPagedUsers;
using taskmaster_pro.Application.Features.Admin.ViewModels;
using taskmaster_pro.Application.Features.Users.DTOs;

namespace taskmaster_pro.Application.Interfaces
{
    public interface IUserService
    {
        Task<bool> UserExistsAsync(Guid userId);
        Task<IEnumerable<UserViewModel>> GetAllUsersAsync();
        Task<List<UserDto>> SearchUsersAsync(string query);
        Task<(IEnumerable<UserViewModel> Users, int TotalRecords)> GetPagedUsersAsync(GetPagedUsersQuery request, CancellationToken cancellationToken = default);
        Task<UserViewModel> GetUserByIdAsync(Guid userId);
        Task<AdminUserViewModel> GetAdminUserByIdAsync(Guid userId);
        Task<List<string>> GetRolesAsync(Guid userId);
        Task ChangeUserRolesAsync(Guid userId, List<string> newRoles);
        Task ResetSecurityAttemptsAsync(Guid userId);
        Task ChangePasswordAsync(string userId, string currentPassword, string newPassword);
        Task UpdateUserAsync(UserViewModel user);
        Task DeleteUserAsync(Guid userId);
        Task<int> GetTotalUsersAsync(bool confirmedOnly = true);
    }
}
