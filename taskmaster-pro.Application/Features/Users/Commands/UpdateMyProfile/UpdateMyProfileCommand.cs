namespace taskmaster_pro.Application.Features.Users.Commands.UpdateMyProfile
{
    public class UpdateMyProfileCommand : IRequest<Unit>
    {
        public string UserId { get; set; } = default!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
    }
}
