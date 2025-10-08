using System.ComponentModel.DataAnnotations;

namespace Features.Admin.Commands.ChangeUserRole
{
    public class ChangeUserRolesCommand : IRequest<Unit>
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one role must be assigned.")]
        public List<string> Roles { get; set; } = new();
    }
}
