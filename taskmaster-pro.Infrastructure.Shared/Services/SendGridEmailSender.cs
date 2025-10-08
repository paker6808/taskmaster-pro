using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using taskmaster_pro.Infrastructure.Shared.Settings;

namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class SendGridEmailSender : IEmailSender
    {
        private readonly SendGridClient _client;
        private readonly EmailAddress _fromEmail;

        public SendGridEmailSender(IOptions<SendGridSettings> options)
        {
            var settings = options.Value ?? throw new ArgumentNullException(nameof(options));
            _client = new SendGridClient(settings.ApiKey);
            _fromEmail = new EmailAddress(settings.FromEmail, settings.FromName);
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            var msg = MailHelper.CreateSingleEmail(_fromEmail, new EmailAddress(toEmail), subject, "", htmlContent);
            var response = await _client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to send email via SendGrid: {response.StatusCode}");
            }
        }
    }
}
