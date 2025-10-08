using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace taskmaster_pro.Infrastructure.Shared.Services.Session
{
    public class InMemorySessionService : ISessionService
    {
        private readonly ConcurrentDictionary<string, SessionInfo> _store = new();

        public Task<string> CreateSessionAsync(string email, int expiresInMinutes = 10)
        {
            var token = GenerateSecureToken(32);
            var now = DateTimeOffset.UtcNow;
            var info = new SessionInfo
            {
                Email = email,
                CreatedAt = now,
                ExpiresAt = now.AddMinutes(expiresInMinutes),
                Used = false
            };

            _store[token] = info;
            return Task.FromResult(token);
        }

        public Task<bool> ValidateSessionTokenAsync(string token, string email)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(email)) return Task.FromResult(false);

            if (!_store.TryGetValue(token, out var info)) return Task.FromResult(false);

            if (!string.Equals(info.Email, email, StringComparison.OrdinalIgnoreCase)) return Task.FromResult(false);
            if (info.Used) return Task.FromResult(false);
            if (info.ExpiresAt < DateTimeOffset.UtcNow) return Task.FromResult(false);

            return Task.FromResult(true);
        }

        public Task MarkSessionTokenUsedAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return Task.CompletedTask;
            if (_store.TryGetValue(token, out var info))
            {
                info.Used = true;
                _store[token] = info;
            }
            return Task.CompletedTask;
        }

        public Task DeleteSessionAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return Task.CompletedTask;
            _store.TryRemove(token, out _);
            return Task.CompletedTask;
        }

        private static string GenerateSecureToken(int byteLength = 32)
        {
            var data = new byte[byteLength];
            RandomNumberGenerator.Fill(data);
            return BitConverter.ToString(data).Replace("-", "").ToLowerInvariant();
        }
    }
}
