namespace taskmaster_pro.Application.Features.Admin.Queries.GetAdminUserById
{
    public class GetAdminUserByIdQueryValidator : AbstractValidator<GetAdminUserByIdQuery>
    {
        public GetAdminUserByIdQueryValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("User ID must be provided.");
        }
    }
}
