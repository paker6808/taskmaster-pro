using AutoMapper;
using taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;
using PersistenceExtensions = taskmaster_pro.Infrastructure.Persistence.Extensions.IQueryableExtensions;
using taskmaster_pro.Infrastructure.Persistence.Extensions;
using static taskmaster_pro.Application.Features.Dashboard.Queries.GetDashboard.GetDashboardStatsQuery;

namespace taskmaster_pro.Infrastructure.Persistence.Repositories
{
    public class SchedulesRepositoryAsync : IScheduleRepositoryAsync
    {
        private readonly DbSet<ScheduleEntity> _repository;
        private readonly ApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public SchedulesRepositoryAsync(
            ApplicationDbContext dbContext,
            ICurrentUserService currentUserService,
            IMapper mapper
            )
        {
            _repository = dbContext.Set<ScheduleEntity>();
            _dbContext = dbContext;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        #region UI-specific methods

        public async Task<ScheduleViewModel?> GetByIdWithAssignedUserAsync(Guid id)
        {
            var entity = await _repository
                .AsNoTracking()
                .Include(s => s.AssignedTo)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return null;

            // Mask email if the AssignedTo user is deleted
            if (entity.AssignedTo != null && entity.AssignedTo.IsDeleted)
                entity.AssignedTo.Email = MaskEmailForDeletedUsers(entity.AssignedTo.Email);

            return _mapper.Map<ScheduleViewModel>(entity);
        }

        #endregion

        #region Domain-level reading methods (used by handlers)

        public async Task<Schedule?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.FindAsync(id);
            return entity == null ? null : _mapper.Map<Schedule>(entity);
        }

        public async Task<IEnumerable<Schedule>> GetAllShapeAsync(string orderBy, string fields)
        {
            var query = _repository
                .AsNoTracking()
                .Include(s => s.AssignedTo)
                .AsExpandable();

            if (!string.IsNullOrWhiteSpace(orderBy))
                query = query.ApplyOrdering(orderBy);

            var entities = await query.ToListAsync();
            return _mapper.Map<IEnumerable<Schedule>>(entities);
        }

        public async Task<(IEnumerable<GetSchedulesViewModel> data, int totalRecords)> GetUserSchedulesAsync(GetSchedulesQuery requestParameters)
        {
            var orderBy = requestParameters.OrderBy;
            var pageNumber = requestParameters.PageNumber;
            var pageSize = requestParameters.PageSize;

            var query = _repository
                .AsNoTracking()
                .Include(s => s.AssignedTo)
                .AsExpandable();

            var currentUserId = _currentUserService.UserId;
            var isAdmin = _currentUserService.GetUserRole() == "Admin";

            if (!isAdmin)
                query = query.Where(s => s.UserId == currentUserId || s.AssignedToId == currentUserId);

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                query = PersistenceExtensions.ApplyOrdering(query, orderBy);
            }

            var totalRecords = await query.CountAsync();

            var entities = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map entities back to domain
            var data = _mapper.Map<IEnumerable<GetSchedulesViewModel>>(entities);

            // Mask email if the AssignedTo user is deleted
            foreach (var item in data)
            {
                if (item.AssignedTo != null && item.AssignedTo.IsDeleted)
                {
                    item.AssignedTo.Email = MaskEmailForDeletedUsers(item.AssignedTo.Email);
                }
            }

            return (data, totalRecords);
        }

        public async Task<(IEnumerable<PagedSchedulesViewModel> data, long recordsCount)> GetPagedUserSchedulesAsync(PagedSchedulesQuery requestParameters)
        {
            var orderBy = requestParameters.OrderBy;
            var pageNumber = requestParameters.PageNumber;
            var pageSize = requestParameters.PageSize;

            var query = _repository
                .AsNoTracking()
                .Include(s => s.AssignedTo)
                .AsExpandable();

            var currentUserId = _currentUserService.UserId;
            var isAdmin = _currentUserService.GetUserRole() == "Admin";

            if (_currentUserService.GetUserRole() != "Admin" || !requestParameters.IncludeAllForAdmin)
                query = query.Where(o => o.UserId == _currentUserService.UserId || o.AssignedToId == currentUserId);

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                query = PersistenceExtensions.ApplyOrdering(query, orderBy);
            }

            var totalRecords = await query.CountAsync();

            var entities = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Map entities back to domain
            var data = _mapper.Map<IEnumerable<PagedSchedulesViewModel>>(entities);

            // Mask email if the AssignedTo user is deleted
            foreach (var item in data)
            {
                if (item.AssignedTo != null && item.AssignedTo.IsDeleted)
                {
                    item.AssignedTo.Email = MaskEmailForDeletedUsers(item.AssignedTo.Email);
                }
            }

            return (data, totalRecords);
        }

        public async Task<IEnumerable<Schedule>> GetByOrderIdAsync(Guid orderId)
        {
            var entities = await _repository
                .AsNoTracking()
                .Include(s => s.AssignedTo)
                .Where(s => s.OrderId == orderId)
                .ToListAsync();

            // Map entities back to domain
            return _mapper.Map<IEnumerable<Schedule>>(entities);
        }

        public async Task<int> GetTotalSchedulesAsync()
        {
            return await _repository.CountAsync();
        }

        public async Task<List<MonthlyCountDto>> GetMonthlyScheduleCountsAsync(int year)
        {
            var monthGroups = await _repository
                .Where(s => s.ScheduledStart.Year == year)
                .GroupBy(s => s.ScheduledStart.Month)
                .Select(g => new { Month = g.Key, Count = g.Count() })
                .ToListAsync();

            var monthlyCounts = Enumerable.Range(1, 12)
                .Select(m => new MonthlyCountDto
                {
                    Month = m,
                    Count = monthGroups.FirstOrDefault(g => g.Month == m)?.Count ?? 0
                })
                .ToList();

            return monthlyCounts;
        }

        #endregion

        #region CRUD methods

        public async Task<Schedule> AddAsync(Schedule schedule)
        {
            var entity = _mapper.Map<ScheduleEntity>(schedule);
            await _repository.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<Schedule>(entity);
        }

        public async Task<Schedule> UpdateAsync(Schedule schedule)
        {
            var entity = await _repository.FindAsync(schedule.Id);
            if (entity == null) throw new KeyNotFoundException($"Schedule {schedule.Id} not found");

            // Map updated fields from domain -> entity
            _mapper.Map(schedule, entity);

            _repository.Update(entity);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<Schedule>(entity);
        }

        public async Task DeleteAsync(Schedule schedule)
        {
            var entity = await _repository.FindAsync(schedule.Id);
            if (entity == null) throw new KeyNotFoundException($"Schedule {schedule.Id} not found");

            _repository.Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        #endregion

        #region Additional methods

        public Task<bool> SeedDataAsync(int rowCount)
        {
            throw new NotImplementedException();
        }

        private string MaskEmailForDeletedUsers(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return email;
            var parts = email.Split('@');
            if (parts[0].Length <= 2) return "***@" + parts[1];
            return parts[0].Substring(0, 2) + "***@" + parts[1] + " (Deleted User)";
        }

        #endregion
    }
}