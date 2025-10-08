namespace taskmaster_pro.Application.Features.Users.Queries.UserExists
{
    public class UserExistsQuery : IRequest<bool>
    {
        public string UserId { get; set; } = default!;
    }
}
