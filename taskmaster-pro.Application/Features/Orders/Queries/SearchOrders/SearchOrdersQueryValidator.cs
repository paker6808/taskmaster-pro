namespace taskmaster_pro.Application.Features.Orders.Queries.SearchOrders
{
    public class SearchOrdersQueryValidator : AbstractValidator<SearchOrdersQuery>
    {
        public SearchOrdersQueryValidator()
        {
            RuleFor(x => x.Query)
                .NotEmpty()
                .MinimumLength(2);
        }
    }
}
