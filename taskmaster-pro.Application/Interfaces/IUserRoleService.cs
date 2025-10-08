namespace taskmaster_pro.Application.Interfaces
{
    public interface IUserRoleService
    {
        Task UpdateRolesAsync(string userId, List<string> roles);
    }
}
