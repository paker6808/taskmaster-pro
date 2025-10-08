namespace taskmaster_pro.Application.Features.Authentication.Commands.GetSecurityQuestion
{
    public class GetSecurityQuestionCommandValidator : AbstractValidator<GetSecurityQuestionCommand>
    {
        public GetSecurityQuestionCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(254);

            RuleFor(x => x.RecaptchaToken)
                .NotEmpty()
                .WithMessage("Recaptcha token is required.");
        }
    }
}
