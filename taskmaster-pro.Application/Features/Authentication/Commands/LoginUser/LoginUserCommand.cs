namespace taskmaster_pro.Application.Features.Authentication.Commands.LoginUser
{
    public class LoginUserCommand : IRequest<LoginUserResult>
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    public class LoginUserResult
    {
        public bool Succeeded { get; set; }
        public string? Token { get; set; }
        public string? Error { get; set; }
        public string? Code { get; set; }
    }
}
