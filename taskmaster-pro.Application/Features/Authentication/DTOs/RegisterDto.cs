using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class RegisterDto
    {
        [Required, StringLength(100)]
        public string FirstName { get; set; }

        [Required, StringLength(100)]
        public string LastName { get; set; }

        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required, MinLength(8)]
        public string Password { get; set; }

        [Required, Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string SecurityQuestion { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string SecurityAnswer { get; set; }

        [Required]
        public string RecaptchaToken { get; set; }
    }
}