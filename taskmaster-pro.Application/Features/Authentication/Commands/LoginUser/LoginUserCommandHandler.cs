namespace taskmaster_pro.Application.Features.Authentication.Commands.LoginUser
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, LoginUserResult>
    {
        private readonly IAuthenticationService _authService;

        public LoginUserCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<LoginUserResult> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            return await _authService.LoginUserAsync(request);
        }
    }

}
