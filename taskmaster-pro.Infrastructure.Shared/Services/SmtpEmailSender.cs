using System.Net;
using System.Net.Mail;

namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class SmtpEmailSender : IEmailSender
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _username;
        private readonly string _password;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public SmtpEmailSender(string host, int port, string username, string password, string fromEmail, string fromName)
        {
            _host = host;
            _port = port;
            _username = username;
            _password = password;
            _fromEmail = fromEmail;
            _fromName = fromName;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            var message = new MailMessage();
            message.From = new MailAddress(_fromEmail, _fromName);
            message.To.Add(toEmail);
            message.Subject = subject;
            message.Body = htmlContent;
            message.IsBodyHtml = true;

            using var smtp = new SmtpClient(_host, _port)
            {
                Credentials = new NetworkCredential(_username, _password),
                EnableSsl = true
            };

            await smtp.SendMailAsync(message);
        }
    }
}
