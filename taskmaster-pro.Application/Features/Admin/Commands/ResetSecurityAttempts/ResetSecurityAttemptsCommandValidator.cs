namespace taskmaster_pro.Application.Features.Admin.Commands.ResetSecurityAttempts
{
    public class ResetSecurityAttemptsCommandValidator : AbstractValidator<ResetSecurityAttemptsCommand>
    {
        public ResetSecurityAttemptsCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("UserId is required.");
        }
    }
}
