using taskmaster_pro.Application.Features.Authentication.DTOs;

namespace taskmaster_pro.Application.Features.Authentication.Commands.ResetPassword
{
    public class ResetPasswordCommand : IRequest<ResetPasswordResult>
    {
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
        public string Password { get; set; } = default!;
    }

    public class ResetPasswordResult
    {
        public bool Succeeded { get; set; }
        public string? Message { get; set; }
        public List<IdentityErrorDto> Errors { get; set; } = new();
    }
}
