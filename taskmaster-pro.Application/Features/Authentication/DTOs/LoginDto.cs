using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class LoginDto
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required, MinLength(8)]
        public string Password { get; set; }
    }
}
