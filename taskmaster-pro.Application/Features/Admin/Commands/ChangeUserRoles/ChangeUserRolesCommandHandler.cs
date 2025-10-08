using Features.Admin.Commands.ChangeUserRole;

namespace taskmaster_pro.Application.Features.Admin.Commands.ChangeUserRole
{
    public class ChangeUserRolesCommandHandler : IRequestHandler<ChangeUserRolesCommand, Unit>
    {
        private readonly IUserService _userService;

        public ChangeUserRolesCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Unit> Handle(ChangeUserRolesCommand request, CancellationToken cancellationToken)
        {
            await _userService.ChangeUserRolesAsync(request.UserId, request.Roles);
            return Unit.Value;
        }
    }
}
