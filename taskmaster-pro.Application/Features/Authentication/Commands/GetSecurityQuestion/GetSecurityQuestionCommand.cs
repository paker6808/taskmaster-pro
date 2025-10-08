namespace taskmaster_pro.Application.Features.Authentication.Commands.GetSecurityQuestion
{
    public class GetSecurityQuestionCommand : IRequest<GetSecurityQuestionResult>
    {
        public string Email { get; set; } = default!;
        public string RecaptchaToken { get; set; } = default!;
    }

    public class GetSecurityQuestionResult
    {
        public string SecurityQuestion { get; set; } = default!;
        public string SessionToken { get; set; } = default!;
    }
}
