using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class UpdateProfileDto
    {
        [Required, StringLength(100)]
        public string FirstName { get; set; }
        
        [Required, StringLength(100)]
        public string LastName { get; set; }

        [EmailAddress, StringLength(254)]
        public string Email { get; set; }
    }
}
