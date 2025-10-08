namespace taskmaster_pro.Application.Features.Authentication.Commands.ConfirmEmail
{
    public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, ConfirmEmailResult>
    {
        private readonly IAuthenticationService _authService;

        public ConfirmEmailCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<ConfirmEmailResult> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            return await _authService.ConfirmEmailAsync(request.UserId, request.Token);
        }
    }
}
