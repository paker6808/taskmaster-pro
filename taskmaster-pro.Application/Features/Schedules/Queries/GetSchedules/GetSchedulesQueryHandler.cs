namespace taskmaster_pro.Application.Features.Schedules.Queries.GetSchedules
{
    public class GetSchedulesQueryHandler : IRequestHandler<GetSchedulesQuery, IEnumerable<GetSchedulesViewModel>>
    {
        private readonly IScheduleRepositoryAsync _repository;
        private readonly IModelHelper _modelHelper;
        private readonly IMapper _mapper;

        public GetSchedulesQueryHandler(
            IScheduleRepositoryAsync repository,
            IModelHelper modelHelper,
            IMapper mapper)
        {
            _repository = repository;
            _modelHelper = modelHelper;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetSchedulesViewModel>> Handle(GetSchedulesQuery request, CancellationToken cancellationToken)
        {
            string fields = _modelHelper.GetModelFields<GetSchedulesViewModel>();
            string orderBy = !string.IsNullOrEmpty(request.OrderBy)
                ? _modelHelper.ValidateModelFields<GetSchedulesViewModel>(request.OrderBy)
                : "ScheduledStart";

            var schedules = await _repository.GetAllShapeAsync(orderBy, fields);

            return _mapper.Map<IEnumerable<GetSchedulesViewModel>>(schedules);
        }
    }
}