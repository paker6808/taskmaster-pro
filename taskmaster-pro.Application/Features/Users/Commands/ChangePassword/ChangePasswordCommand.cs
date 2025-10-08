namespace taskmaster_pro.Application.Features.Users.Commands.ChangePassword
{
    public class ChangePasswordCommand : IRequest<Unit>
    {
        public string UserId { get; set; } = default!;
        public string CurrentPassword { get; set; } = default!;
        public string NewPassword { get; set; } = default!;
    }
}
