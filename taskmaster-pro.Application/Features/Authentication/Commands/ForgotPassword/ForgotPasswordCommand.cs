namespace taskmaster_pro.Application.Features.Authentication.Commands.ForgotPassword
{
    public class ForgotPasswordCommand : IRequest<ForgotPasswordResult>
    {
        public string Email { get; set; } = default!;
    }

    public class ForgotPasswordResult
    {
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
    }
}
