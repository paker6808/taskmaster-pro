namespace taskmaster_pro.Application.Interfaces
{
    /// <summary>
    /// Interface for the current user service that provides the user ID of the currently authenticated user.
    /// This is typically used to filter data based on the user context in queries and commands.
    /// </summary>
    public interface ICurrentUserService {
        /// <summary>
        /// Gets the unique identifier of the currently authenticated user.
        /// </summary>
        /// <value>
        /// The user ID of the currently authenticated user.
        // </value>
        /// <returns>
        /// A string representing the user ID.
        /// </returns>
        string UserId { get; }

        /// <summary>
        /// Gets the role of the currently authenticated user.
        /// </summary>
        /// <value>
        /// The role of the currently authenticated user.
        /// </value>
        /// <returns>
        /// A string representing the user role.
        /// </returns>
        string GetUserRole();
    }
}
