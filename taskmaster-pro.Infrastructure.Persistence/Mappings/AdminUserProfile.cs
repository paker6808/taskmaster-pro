using AutoMapper;
using taskmaster_pro.Application.Features.Admin.ViewModels;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;

namespace taskmaster_pro.Infrastructure.Persistence.Mappings
{
    public class AdminUserProfile : Profile
    {
        public AdminUserProfile()
        {
            CreateMap<ApplicationUser, AdminUserViewModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => src.EmailConfirmed))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted))
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.SecurityQuestion, opt => opt.Ignore())
                .ForMember(dest => dest.FailedSecurityQuestionAttempts, opt => opt.Ignore());
        }
    }
}
