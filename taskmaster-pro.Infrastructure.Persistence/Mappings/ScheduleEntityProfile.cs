using AutoMapper;
using taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;

namespace taskmaster_pro.Infrastructure.Persistence.Mappings
{
    public class ScheduleEntityProfile : Profile
    {
        public ScheduleEntityProfile()
        {
            CreateMap<ScheduleEntity, Schedule>()
                .ForMember(dest => dest.AssignedToId, opt => opt.MapFrom(src => src.AssignedToId))
                .ReverseMap();

            CreateMap<ScheduleEntity, ScheduleViewModel>()
                .ForMember(dest => dest.AssignedToId, opt => opt.MapFrom(src => src.AssignedToId))
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(d => d.CreatedById, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(d => d.UpdatedById, opt => opt.MapFrom(src => src.UpdatedBy))
                .ForMember(d => d.CreatedBy, opt => opt.Ignore())
                .ForMember(d => d.UpdatedBy, opt => opt.Ignore());

            CreateMap<ScheduleEntity, GetSchedulesViewModel>()
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo))
                .ForMember(dest => dest.AssignedToId, opt => opt.MapFrom(src => src.AssignedToId))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.UpdatedBy));

            CreateMap<ScheduleEntity, PagedSchedulesViewModel>()
                .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo))
                .ForMember(dest => dest.Created, opt => opt.MapFrom(src => src.Created))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.Updated, opt => opt.MapFrom(src => src.Updated))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.UpdatedBy));
        }
    }
}
