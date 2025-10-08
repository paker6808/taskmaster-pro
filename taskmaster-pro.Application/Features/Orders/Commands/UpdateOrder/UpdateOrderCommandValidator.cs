namespace taskmaster_pro.Application.Features.Orders.Commands.CreateOrder
{
    public class UpdateOrderCommandValidator : AbstractValidator<UpdateOrderCommand>
    {
        public UpdateOrderCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.OrderDate).NotEmpty();
            RuleFor(x => x.Status).IsInEnum();
            RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0);
        }
    }
}
