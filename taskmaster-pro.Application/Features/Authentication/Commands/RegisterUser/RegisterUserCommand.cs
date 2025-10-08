using taskmaster_pro.Application.Features.Authentication.DTOs;

namespace taskmaster_pro.Application.Features.Authentication.Commands.RegisterUser
{
    public class RegisterUserCommand : IRequest<RegisterUserResult>
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public string SecurityQuestion { get; set; } = default!;
        public string SecurityAnswer { get; set; } = default!;
        public string RecaptchaToken { get; set; } = default!;
    }

    public class RegisterUserResult
    {
        public string? UserId { get; set; } = default!;
        public string? Token { get; set; } = default!;
        public bool Succeeded { get; set; }
        public List<IdentityErrorDto> Errors { get; set; } = new();
    }
}
