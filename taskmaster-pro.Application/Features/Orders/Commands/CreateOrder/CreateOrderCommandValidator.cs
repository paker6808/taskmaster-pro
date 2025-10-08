using Features.Orders.Commands.CreateOrder;

namespace taskmaster_pro.Application.Features.Orders.Commands.CreateOrder
{
    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.OrderDate).NotEmpty();
            RuleFor(x => x.Status).IsInEnum();
            RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0);
        }
    }
}
