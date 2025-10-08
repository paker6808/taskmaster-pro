using taskmaster_pro.Application.Features.Users.DTOs;

namespace taskmaster_pro.Application.Features.Users.Queries.SearchUsers
{
    public class SearchUsersQuery : IRequest<List<UserDto>>
{
    public string Query { get; set; } = string.Empty;
}
}
