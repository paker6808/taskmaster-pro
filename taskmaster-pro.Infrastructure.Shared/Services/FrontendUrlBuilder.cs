namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class FrontendUrlBuilder : IFrontendUrlBuilder
    {
        private readonly IConfiguration _config;
        public FrontendUrlBuilder(IConfiguration config) => _config = config;

        public string BuildEmailConfirmationLink(string userId, string token)
        {
            var frontendBase = _config["Frontend:BaseUrl"] ?? throw new InvalidOperationException("Frontend:BaseUrl not configured");
            var userIdParam = Uri.EscapeDataString(userId);
            var tokenParam = Uri.EscapeDataString(token);
            return $"{frontendBase}/email-confirmation?userId={userIdParam}&token={tokenParam}";
        }

        public string BuildResetPasswordLink(string encodedEmail, string encodedToken)
        {
            var frontendBase = _config["Frontend:BaseUrl"] ?? throw new InvalidOperationException("Frontend:BaseUrl not configured");
            return $"{frontendBase}/reset-password?email={encodedEmail}&token={encodedToken}";
        }
    }
}
