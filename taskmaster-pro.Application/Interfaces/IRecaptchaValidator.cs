namespace taskmaster_pro.Application.Interfaces
{
    public interface IRecaptchaValidator
    {
        /// <summary>
        /// Verifies the given reCAPTCHA token with Google.
        /// </summary>
        /// <param name="token">The token from the client</param>
        /// <returns>True if valid</returns>
        Task<bool> IsCaptchaValidAsync(string token);
    }
}
