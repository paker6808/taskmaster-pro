namespace taskmaster_pro.Application.Features.Authentication.Commands.VerifySecurityAnswer
{
    public class VerifySecurityAnswerCommandHandler : IRequestHandler<VerifySecurityAnswerCommand, VerifySecurityAnswerResult>
    {
        private readonly IAuthenticationService _authService;

        public VerifySecurityAnswerCommandHandler(IAuthenticationService authService)
        {
            _authService = authService;
        }

        public async Task<VerifySecurityAnswerResult> Handle(VerifySecurityAnswerCommand request, CancellationToken cancellationToken)
        {
            return await _authService.VerifySecurityAnswerAsync(request.Email, request.SecurityAnswer, request.SessionToken);
        }
    }

}
