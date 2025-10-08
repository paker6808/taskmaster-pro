using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class ResetPasswordDto
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required, MinLength(8)]
        public string Password { get; set; }

        [Required, Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; }
    }
}