namespace taskmaster_pro.Application.Interfaces
{
    public interface ISessionService
    {
        /// <summary>
        /// Create a session token for the email. The token will expire after the specified time.
        /// </summary>
        Task<string> CreateSessionAsync(string email, int expiresInMinutes = 10);
        /// <summary>
        /// Validate session token for the email. Returns true if valid (exists, not expired, not used, matches email).
        /// </summary>
        Task<bool> ValidateSessionTokenAsync(string token, string email);
        /// <summary>
        /// Mark session token as used so it cannot be reused.
        /// </summary>
        Task MarkSessionTokenUsedAsync(string token);
        /// <summary>
        /// Delete session token.
        /// </summary>
        Task DeleteSessionAsync(string token);
    }
}
