namespace taskmaster_pro.Application.Features.Authentication.Commands.ForgotPassword
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResult>
    {
        private readonly IAuthenticationService _authService;

        public ForgotPasswordCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<ForgotPasswordResult> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            return await _authService.ForgotPasswordAsync(request);
        }
    }

}
