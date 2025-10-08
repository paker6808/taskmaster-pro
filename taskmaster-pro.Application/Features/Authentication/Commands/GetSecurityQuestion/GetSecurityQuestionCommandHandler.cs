namespace taskmaster_pro.Application.Features.Authentication.Commands.GetSecurityQuestion
{
    public class GetSecurityQuestionCommandHandler : IRequestHandler<GetSecurityQuestionCommand, GetSecurityQuestionResult?>
    {
        private readonly IAuthenticationService _authService;

        public GetSecurityQuestionCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<GetSecurityQuestionResult?> Handle(GetSecurityQuestionCommand request, CancellationToken cancellationToken)
        {
            return await _authService.GetSecurityQuestionAsync(request.Email);
        }
    }
}
