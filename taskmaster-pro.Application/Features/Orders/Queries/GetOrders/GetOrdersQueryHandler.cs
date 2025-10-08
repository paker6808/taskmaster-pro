namespace taskmaster_pro.Application.Features.Orders.Queries.GetOrders
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IEnumerable<GetOrdersViewModel>>
    {
        private readonly IOrderRepositoryAsync _repository;
        private readonly IModelHelper _modelHelper;
        private readonly IMapper _mapper;

        public GetOrdersQueryHandler(
            IOrderRepositoryAsync repository,
            IModelHelper modelHelper,
            IMapper mapper)
        {
            _repository = repository;
            _modelHelper = modelHelper;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetOrdersViewModel>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            string fields = _modelHelper.GetModelFields<GetOrdersViewModel>();
            string orderBy = !string.IsNullOrEmpty(request.OrderBy)
                ? _modelHelper.ValidateModelFields<GetOrdersViewModel>(request.OrderBy)
                : "OrderDate";

            var orders = await _repository.GetAllShapeAsync(orderBy, fields);

            return _mapper.Map<IEnumerable<GetOrdersViewModel>>(orders);
        }
    }
}