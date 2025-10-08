using taskmaster_pro.Application.Features.Admin.ViewModels;

namespace taskmaster_pro.Application.Features.Admin.Queries.GetAdminUserById
{
    public class GetAdminUserByIdQuery : IRequest<AdminUserViewModel>
    {
        public Guid UserId { get; }

        public GetAdminUserByIdQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}
