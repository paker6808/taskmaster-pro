namespace taskmaster_pro.Application.Features.Authentication.Commands.RegisterUser
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterUserResult>
    {
        private readonly IAuthenticationService _authService;

        public RegisterUserCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<RegisterUserResult> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RegisterUserAsync(request);
        }
    }

}
