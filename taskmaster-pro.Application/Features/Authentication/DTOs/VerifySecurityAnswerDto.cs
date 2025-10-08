using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class VerifySecurityAnswerDto
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required, StringLength(100, MinimumLength = 3)]
        public string SecurityAnswer { get; set; }

        [Required]
        public string RecaptchaToken { get; set; }

        public string SessionToken { get; set; }
    }
}
