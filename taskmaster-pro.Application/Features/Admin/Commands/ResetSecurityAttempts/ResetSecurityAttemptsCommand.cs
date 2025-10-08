namespace taskmaster_pro.Application.Features.Admin.Commands.ResetSecurityAttempts
{
    public class ResetSecurityAttemptsCommand : IRequest<Unit>
    {
        public Guid UserId { get; set; }
    }
}
