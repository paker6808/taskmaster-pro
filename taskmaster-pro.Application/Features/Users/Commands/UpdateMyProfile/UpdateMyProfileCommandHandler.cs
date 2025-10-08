namespace taskmaster_pro.Application.Features.Users.Commands.UpdateMyProfile
{
    public class UpdateMyProfileCommandHandler : IRequestHandler<UpdateMyProfileCommand, Unit>
    {
        private readonly IUserService _userService;

        public UpdateMyProfileCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<Unit> Handle(UpdateMyProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userService.GetUserByIdAsync(Guid.Parse(request.UserId));
            if (user == null)
                    throw new NotFoundException("User", request.UserId);

            // Preserve existing values if null
            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.Email = request.Email ?? user.Email;

            await _userService.UpdateUserAsync(user);

            return Unit.Value;
        
        }
    }
}
