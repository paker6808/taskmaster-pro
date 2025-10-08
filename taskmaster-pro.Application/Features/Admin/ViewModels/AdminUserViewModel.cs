namespace taskmaster_pro.Application.Features.Admin.ViewModels
{
    public class AdminUserViewModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public string FullName { get; set; }
        public bool IsDeleted { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
        public string SecurityQuestion { get; set; }
        public int FailedSecurityQuestionAttempts { get; set; }
        public double? LockoutEndMinutesRemaining { get; set; }
    }
}
