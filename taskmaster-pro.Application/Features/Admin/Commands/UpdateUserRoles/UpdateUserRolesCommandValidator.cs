namespace taskmaster_pro.Application.Features.Admin.Commands.UpdateUserRoles
{
    public class UpdateUserRolesCommandValidator : AbstractValidator<UpdateUserRolesCommand>
    {
        public UpdateUserRolesCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required.");

            RuleFor(x => x.Roles)
                .NotNull().WithMessage("Roles list cannot be null.")
                .NotEmpty().WithMessage("At least one role must be provided.");
        }
    }
}
