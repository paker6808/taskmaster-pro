using taskmaster_pro.Application.Interfaces;
using taskmaster_pro.Infrastructure.Shared.Services.Session;

namespace taskmaster_pro.WebApi.Services
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSessionService(this IServiceCollection services, IConfiguration configuration)
        {
            var redisConn = configuration["Redis:Connection"];
            if (!string.IsNullOrWhiteSpace(redisConn))
            {
                // Register distributed cache using redis (StackExchange)
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConn;
                    options.InstanceName = "taskmaster_pro:";
                });

                services.AddSingleton<ISessionService, DistributedSessionService>();
            }
            else
            {
                // Fallback to in-memory for dev
                services.AddSingleton<ISessionService, InMemorySessionService>();
            }

            return services;
        }
    }
}
