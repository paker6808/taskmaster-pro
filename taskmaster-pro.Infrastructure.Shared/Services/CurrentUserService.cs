using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _http;
        public CurrentUserService(IHttpContextAccessor http) => _http = http;
        public string UserId => _http.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        public string GetUserRole()
        {
            var user = _http.HttpContext?.User;
            if (user == null) return string.Empty;

            // If the user has the Admin role, prefer that
            if (user.IsInRole("Admin")) return "Admin";

            // Try the usual claim types (cover both mappings)
            var roleClaim = user.FindFirst(ClaimTypes.Role) ?? user.FindFirst("role");

            // Fall back to first role claim value or empty string
            return roleClaim?.Value ?? string.Empty;
        }
    }
}
