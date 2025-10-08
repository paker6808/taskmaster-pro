using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Application.Features.Authentication.DTOs
{
    public class SecurityQuestionRequestDto
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; }

        [Required]
        public string RecaptchaToken { get; set; }
    }

}
