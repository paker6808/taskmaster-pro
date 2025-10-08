using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class EmailRecaptchaDto
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required]
        public string RecaptchaToken { get; set; }
    }

    public class ForgotPasswordDto : EmailRecaptchaDto { }
}
