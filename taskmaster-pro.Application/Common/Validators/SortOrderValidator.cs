namespace taskmaster_pro.Application.Common.Validators
{
    public class SortOrderValidator : AbstractValidator<SortOrder>
    {
        public SortOrderValidator()
        {
            RuleFor(x => x.Column).GreaterThanOrEqualTo(0).WithMessage("Column index must be >= 0");
            RuleFor(x => x.Dir)
                .NotEmpty()
                .Must(dir => dir.ToLower() == "asc" || dir.ToLower() == "desc")
                .WithMessage("Dir must be 'asc' or 'desc'");
        }
    }
}
