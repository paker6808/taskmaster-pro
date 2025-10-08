namespace taskmaster_pro.Application.Features.Authentication.Commands.ResetPassword
{
    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResult>
    {
        private readonly IAuthenticationService _authService;

        public ResetPasswordCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<ResetPasswordResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            return await _authService.ResetPasswordAsync(request.Email, request.Token, request.Password);
        }
    }

}
