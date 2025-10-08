namespace taskmaster_pro.Application.Features.Authentication.Commands.RegisterUser
{
    public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserCommandValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(254);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8)
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one digit.");

            RuleFor(x => x.SecurityQuestion)
                .NotEmpty()
                .Length(5, 200);

            RuleFor(x => x.SecurityAnswer)
                .NotEmpty()
                .Length(3, 200);

            RuleFor(x => x.RecaptchaToken)
                .NotEmpty()
                .WithMessage("Recaptcha token is required.");
        }
    }
}
