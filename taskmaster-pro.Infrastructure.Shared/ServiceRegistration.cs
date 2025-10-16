using taskmaster_pro.Infrastructure.Shared.Settings;

namespace taskmaster_pro.Infrastructure.Shared
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddSharedInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            // Settings
            services.Configure<MailSettings>(config.GetSection("MailSettings"));
            services.Configure<RecaptchaSettings>(config.GetSection("Recaptcha"));

            // Utilities
            services.AddSingleton<IDateTimeService, DateTimeService>();
            services.AddTransient<IMockService, MockService>();

            // Recaptcha validator (depends on IHttpClientFactory)
            services.AddTransient<IRecaptchaValidator, RecaptchaValidator>();

            // Frontend URL builder (reads IConfiguration)
            services.AddSingleton<IFrontendUrlBuilder, FrontendUrlBuilder>();

            // Current user service
            services.AddScoped<ICurrentUserService, CurrentUserService>();

            return services;
        }
    }
}