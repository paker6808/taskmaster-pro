using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace taskmaster_pro.Infrastructure.Persistence.Contexts.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData, Required]
        public string FirstName { get; set; }

        [PersonalData, Required]
        public string LastName { get; set; }

        [PersonalData, Required]
        public string SecurityQuestion { get; set; }

        [PersonalData, Required]
        public string SecurityAnswerHash { get; set; }

        public int FailedSecurityQuestionAttempts { get; set; } = 0;

        public DateTime? SecurityQuestionLockoutEnd { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
