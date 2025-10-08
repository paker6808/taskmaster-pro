using Features.Admin.Commands.ChangeUserRole;
using taskmaster_pro.Application.Common.Constants;

namespace taskmaster_pro.Application.Features.Admin.Commands.ChangeUserRole
{
    public class ChangeUserRolesCommandValidator : AbstractValidator<ChangeUserRolesCommand>
    {
        public ChangeUserRolesCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("UserId is required.");

            RuleFor(x => x.Roles)
                .NotEmpty()
                .WithMessage("At least one role must be assigned.");

            RuleForEach(x => x.Roles)
                .NotEmpty()
                .Must(RoleConstants.ValidRoles.Contains)
                .WithMessage("Invalid role specified.");
        }
    }
}
