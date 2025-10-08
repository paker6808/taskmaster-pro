namespace taskmaster_pro.Application.Features.Admin.Commands.UpdateUserRoles
{
    public record UpdateUserRolesCommand(string UserId, List<string> Roles) : IRequest<Unit>;
}
