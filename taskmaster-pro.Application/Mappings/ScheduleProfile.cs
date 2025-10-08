using taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;

namespace taskmaster_pro.Application.Mappings
{
    public class ScheduleProfile : Profile
    {
        public ScheduleProfile()
        {
            CreateMap<Schedule, GetSchedulesViewModel>()
                 .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                 .ReverseMap();
            CreateMap<Schedule, ScheduleViewModel>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
            CreateMap<Schedule, PagedSchedulesViewModel>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
        }
    }
}
