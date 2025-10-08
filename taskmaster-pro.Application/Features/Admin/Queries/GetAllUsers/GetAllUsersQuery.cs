using Features.Users.ViewModels;

namespace taskmaster_pro.Application.Features.Admin.Queries.GetAllUsers
{
    public class GetAllUsersQuery : IRequest<IEnumerable<UserViewModel>> { }
}
