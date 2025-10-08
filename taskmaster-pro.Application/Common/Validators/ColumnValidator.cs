namespace taskmaster_pro.Application.Common.Validators
{
    public class ColumnValidator : AbstractValidator<Column>
    {
        public ColumnValidator()
        {
            RuleFor(x => x.Data).NotEmpty().WithMessage("Column data is required");
            RuleFor(x => x.Name).NotEmpty().WithMessage("Column name is required");
        }
    }

}
