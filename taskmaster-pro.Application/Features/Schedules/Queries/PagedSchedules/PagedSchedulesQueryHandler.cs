namespace taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules
{
    public class PagedSchedulesQueryHandler : IRequestHandler<PagedSchedulesQuery, PagedDataTableResponse<IEnumerable<IDictionary<string, object>>>>
    {
        private readonly IScheduleRepositoryAsync _repository;
        private readonly IModelHelper _modelHelper;
        private readonly IMapper _mapper;
        private readonly IDataShapeHelper<PagedSchedulesViewModel> _dataShapeHelper;

        public PagedSchedulesQueryHandler(
            IScheduleRepositoryAsync repository,
            IModelHelper modelHelper,
            IMapper mapper,
            IDataShapeHelper<PagedSchedulesViewModel> dataShapeHelper)
        {
            _repository = repository;
            _modelHelper = modelHelper;
            _mapper = mapper;
            _dataShapeHelper = dataShapeHelper;
        }

        public async Task<PagedDataTableResponse<IEnumerable<IDictionary<string, object>>>> Handle(PagedSchedulesQuery request, CancellationToken cancellationToken)
        {
            // Map DataTable-style params to standard paging
            request.PageNumber = (request.Start / request.Length) + 1;
            request.PageSize = request.Length;

            // Build OrderBy string
            if (request.Order?.Any() == true && request.Order[0].Column >= 0)
            {
                var sortColumn = request.Columns[request.Order[0].Column].Data;
                var sortDir = request.Order[0].Dir;
                request.OrderBy = $"{sortColumn} {(sortDir == "desc" ? "DESC" : "ASC")}";
            }

            // Ensure fields
            if (string.IsNullOrEmpty(request.Fields))
                request.Fields = _modelHelper.GetModelFields<PagedSchedulesViewModel>();

            // Call repository
            var (schedules, totalRecords) = await _repository.GetPagedUserSchedulesAsync(request);

            // Map to DTOs and shape data
            var mappedDtos = _mapper.Map<IEnumerable<PagedSchedulesViewModel>>(schedules);

            var shapedData = _dataShapeHelper.ShapeData(mappedDtos, request.Fields);

            return new PagedDataTableResponse<IEnumerable<IDictionary<string, object>>>(
                shapedData,
                request.Draw,
                (int)totalRecords
            );
        }
    }
}