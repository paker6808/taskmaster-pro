using taskmaster_pro.Application.Features.Users.DTOs;

namespace taskmaster_pro.Application.Features.Users.Queries.GetMyProfile
{
    public class GetMyProfileQuery : IRequest<UserProfileDto>
    {
        public string UserId { get; set; } = default!;
    }
}
