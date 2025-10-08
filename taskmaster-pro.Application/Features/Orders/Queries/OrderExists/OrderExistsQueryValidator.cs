namespace taskmaster_pro.Application.Features.Orders.Queries.OrderExists
{
    public class OrderExistsQueryValidator : AbstractValidator<OrderExistsQuery>
    {
        public OrderExistsQueryValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
