using taskmaster_pro.Infrastructure.Persistence.IdentityServices;

namespace taskmaster_pro.Infrastructure.Persistence
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("ApplicationDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly("taskmaster-pro.Infrastructure.Persistence")
                    )
                );
            }

            // Register the generic repository for any T
            services.AddTransient(typeof(IGenericRepositoryAsync<>), typeof(GenericRepositoryAsync<>));

            // Explicitly register the specific repositories for the entities
            services.AddScoped<IOrderRepositoryAsync, OrderRepositoryAsync>();
            services.AddScoped<IScheduleRepositoryAsync, SchedulesRepositoryAsync>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserRoleService, IdentityUserRoleService>();
        }
    }
}