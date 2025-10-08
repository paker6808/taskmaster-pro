using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Admin.Commands
{
    public class DeleteUserCommand : IRequest<Unit>
    {
        [Required]
        public Guid Id { get; set; }
    }
}
