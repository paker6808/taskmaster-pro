namespace taskmaster_pro.Application.Helpers
{
    public static class EmailTemplates
    {
        public static string GetEmailConfirmationTemplate(string confirmationLink)
        {
            return $@"
            <!DOCTYPE html>
            <html>
              <body style=""font-family:Arial,sans-serif;line-height:1.6;"">
                <p>Thanks for registering with TaskMaster Pro!<br/>
                   Please confirm your email by clicking the button below:</p>

                <p style=""text-align:center;"">
                  <a href='{confirmationLink}'
                     style=""
                       display:inline-block;
                       padding:12px 24px;
                       background-color:#d35400;
                       color:#fff;
                       text-decoration:none;
                       font-weight:600;
                       border-radius:4px;
                     "">
                    Confirm Email
                  </a>
                </p>

                <p style=""
                     font-size:0.85rem;
                     color:#777;
                     margin-top:24px;
                   "">
                  If you did not create this account, please ignore this email.
                </p>
              </body>
            </html>";
        }

        public static string GetPasswordResetTemplate(string resetLink)
        {
            return $@"
            <html>
            <body style=""font-family:Arial,sans-serif;line-height:1.6;"">
              <h2>Password Reset Request</h2>
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <p style=""text-align:center;"">
                <a href='{resetLink}' style=""display:inline-block;padding:12px 24px;
                  background-color:#d35400;color:#fff;text-decoration:none;border-radius:4px;"">
                  Reset Password
                </a>
              </p>
              <p style=""font-size:0.85rem;color:#777;margin-top:24px;"">
                If you did not request this, you can ignore this email.
              </p>
            </body>
            </html>";
        }
    }
}