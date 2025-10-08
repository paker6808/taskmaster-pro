using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text.Json;
using taskmaster_pro.Infrastructure.Shared.Settings;

namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class RecaptchaValidator : IRecaptchaValidator
    {
        private readonly RecaptchaSettings _settings;
        private readonly IHttpClientFactory _httpClientFactory;

        public RecaptchaValidator(IOptions<RecaptchaSettings> settings, IHttpClientFactory httpClientFactory)
        {
            _settings = settings.Value;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<bool> IsCaptchaValidAsync(string token)
        {
            var values = new Dictionary<string, string>
            {
                ["secret"] = _settings.SecretKey,
                ["response"] = token
            };
            using var content = new FormUrlEncodedContent(values);

            var client = _httpClientFactory.CreateClient();
            var response = await client.PostAsync(
                "https://www.google.com/recaptcha/api/siteverify",
                content);
            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<RecaptchaResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return data?.Success == true;
        }

        private class RecaptchaResponse
        {
            public bool Success { get; set; }
            public string[] ErrorCodes { get; set; }
        }
    }
}
