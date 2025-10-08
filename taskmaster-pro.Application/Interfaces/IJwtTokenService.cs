namespace taskmaster_pro.Application.Interfaces
{
    /// <summary>
    /// Interface for generating JWT tokens.
    /// </summary>
    public interface IJwtTokenService
    {
        /// <summary>
        /// Generates a JWT token for the specified user and roles.
        /// </summary>
        /// <param name="user">The user for whom the token is generated.</param>
        /// <param name="roles">The roles assigned to the user.</param>
        /// <returns>A JWT token as a string.</returns>
        string GenerateToken(string userId, string email, IList<string> roles);
    }
}