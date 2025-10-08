using taskmaster_pro.Application.Features.Authentication.DTOs;

namespace taskmaster_pro.Application.Common.Validators
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password is required.");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required.")
                .MinimumLength(8).WithMessage("New password must be at least 8 characters.")
                .Matches("[A-Z]").WithMessage("Must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Must contain at least one number.")
                .Matches("[^a-zA-Z0-9]").WithMessage("Must contain at least one special character.");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.NewPassword).WithMessage("Passwords do not match.");
        }
    }
}
