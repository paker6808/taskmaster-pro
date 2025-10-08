namespace taskmaster_pro.Application.Features.Admin.Commands.UpdateUserRoles
{
    public class UpdateUserRolesHandler : IRequestHandler<UpdateUserRolesCommand, Unit>
    {
        private readonly IUserRoleService _userRoleService;

        public UpdateUserRolesHandler(IUserRoleService userRoleService)
        {
            _userRoleService = userRoleService;
        }

        public async Task<Unit> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
        {
            await _userRoleService.UpdateRolesAsync(request.UserId, request.Roles);
            return Unit.Value;
        }
    }
}
