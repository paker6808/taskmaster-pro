namespace taskmaster_pro.Application.Features.Authentication.Commands.VerifySecurityAnswer
{
    public class VerifySecurityAnswerCommandValidator : AbstractValidator<VerifySecurityAnswerCommand>
    {
        public VerifySecurityAnswerCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(254);

            RuleFor(x => x.SecurityAnswer)
                .NotEmpty()
                .Length(3, 200);
        }
    }
}
