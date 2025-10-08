using taskmaster_pro.Application.Features.Users.DTOs;

namespace taskmaster_pro.Application.Features.Users.Queries.GetMyProfile
{
    public class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, UserProfileDto?>
    {
        private readonly IUserService _userService;

        public GetMyProfileQueryHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<UserProfileDto?> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(Guid.Parse(request.UserId));

                return new UserProfileDto
                {
                    Id = user.Id.ToString(),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Roles = user.Roles
                };
            }
            catch
            {
                return null;
            }
        }
    }
}
