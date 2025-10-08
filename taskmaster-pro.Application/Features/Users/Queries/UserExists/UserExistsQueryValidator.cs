namespace taskmaster_pro.Application.Features.Users.Queries.UserExists
{
    public class UserExistsQueryValidator : AbstractValidator<UserExistsQuery>
    {
        public UserExistsQueryValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required.");
        }
    }
}
