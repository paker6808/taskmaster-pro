namespace Features.Users.ViewModels
{
    public class UserViewModel
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName => $"{FirstName} {LastName}".Trim();
        public bool IsDeleted { get; set; }
        public IList<string> Roles { get; set; }
    }
}
