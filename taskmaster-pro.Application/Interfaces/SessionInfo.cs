namespace taskmaster_pro.Application.Interfaces
{
    public class SessionInfo
    {
        public string Email { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public bool Used { get; set; }
    }
}
