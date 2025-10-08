namespace taskmaster_pro.Application.Helpers
{
    public static class SecurityHelper
    {
        public static string HashSecurityAnswer(string answer)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(answer.ToLower().Trim());
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
