namespace taskmaster_pro.Application.Common.Models
{
    public class UserRolesView
    {
        public string Id { get; set; }
        public string Email { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public bool IsDeleted { get; set; }
        public string Roles { get; set; } = "";

        // Sorting columns
        public int HighestRolePriority { get; set; }
        public int RoleCount { get; set; }
    }
}
