using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class ChangeRoleDto
    { 
        [Required]
        [RegularExpression("^(User|Admin)$", ErrorMessage = "Role must be 'User' or 'Admin'.")]
        [StringLength(50)]
        public string Role { get; set; }
    }
}
