namespace taskmaster_pro.Application.Interfaces
{
    public interface IFrontendUrlBuilder
    {
        string BuildEmailConfirmationLink(string userId, string token);
        string BuildResetPasswordLink(string encodedEmail, string encodedToken);
    }
}
