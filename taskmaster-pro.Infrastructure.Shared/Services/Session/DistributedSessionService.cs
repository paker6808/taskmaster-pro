using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text.Json;

namespace taskmaster_pro.Infrastructure.Shared.Services.Session
{
    public class DistributedSessionService : ISessionService
    {
        private readonly IDistributedCache _cache;
        private readonly ILogger<DistributedSessionService> _logger;
        private readonly JsonSerializerOptions _jsonOpts;
        private const string KeyPrefix = "secq:session:";

        public DistributedSessionService(IDistributedCache cache, ILogger<DistributedSessionService> logger)
        {
            _cache = cache;
            _logger = logger;
            _jsonOpts = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        }

        public async Task<string> CreateSessionAsync(string email, int expiresInMinutes = 10)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentNullException(nameof(email));

            var token = GenerateSecureToken(32);
            var now = DateTimeOffset.UtcNow;
            var info = new SessionInfo
            {
                Email = email,
                CreatedAt = now,
                ExpiresAt = now.AddMinutes(expiresInMinutes),
                Used = false
            };

            var bytes = JsonSerializer.SerializeToUtf8Bytes(info, _jsonOpts);

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = info.ExpiresAt.UtcDateTime
            };

            await _cache.SetAsync(KeyPrefix + token, bytes, options);

            return token;
        }

        public async Task<bool> ValidateSessionTokenAsync(string token, string email)
        {
            if (string.IsNullOrWhiteSpace(token)) return false;
            if (string.IsNullOrWhiteSpace(email)) return false;

            var key = KeyPrefix + token;
            var bytes = await _cache.GetAsync(key);
            if (bytes == null) return false;

            try
            {
                var info = JsonSerializer.Deserialize<SessionInfo>(bytes, _jsonOpts);
                if (info == null) return false;

                if (!string.Equals(info.Email, email, StringComparison.OrdinalIgnoreCase)) return false;
                if (info.Used) return false;
                if (info.ExpiresAt < DateTimeOffset.UtcNow) return false;

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task MarkSessionTokenUsedAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return;

            var key = KeyPrefix + token;
            var bytes = await _cache.GetAsync(key);
            if (bytes == null) return;

            try
            {
                var info = JsonSerializer.Deserialize<SessionInfo>(bytes, _jsonOpts);
                if (info == null) return;

                info.Used = true;
                var newBytes = JsonSerializer.SerializeToUtf8Bytes(info, _jsonOpts);

                var remaining = info.ExpiresAt - DateTimeOffset.UtcNow;
                var options = new DistributedCacheEntryOptions();
                if (remaining > TimeSpan.Zero) options.AbsoluteExpirationRelativeToNow = remaining;

                await _cache.SetAsync(key, newBytes, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MarkSessionTokenUsedAsync failed for token {Token}", token);
            }
        }

        public Task DeleteSessionAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return Task.CompletedTask;
            return _cache.RemoveAsync(KeyPrefix + token);
        }

        private static string GenerateSecureToken(int byteLength = 32)
        {
            var data = new byte[byteLength];
            RandomNumberGenerator.Fill(data);
            return BitConverter.ToString(data).Replace("-", "").ToLowerInvariant();
        }
    }
}
