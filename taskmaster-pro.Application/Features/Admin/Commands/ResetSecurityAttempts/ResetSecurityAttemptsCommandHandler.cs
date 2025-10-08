namespace taskmaster_pro.Application.Features.Admin.Commands.ResetSecurityAttempts
{
    public class ResetSecurityAttemptsCommandHandler : IRequestHandler<ResetSecurityAttemptsCommand, Unit>
    {
        private readonly IUserService _userService;

        public ResetSecurityAttemptsCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Unit> Handle(ResetSecurityAttemptsCommand request, CancellationToken cancellationToken)
        {
            await _userService.ResetSecurityAttemptsAsync(request.UserId);
            return Unit.Value;
        }
    }
}
