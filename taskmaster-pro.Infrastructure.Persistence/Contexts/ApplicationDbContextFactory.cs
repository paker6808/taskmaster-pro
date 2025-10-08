using Microsoft.EntityFrameworkCore.Design;
using System.IO;

namespace taskmaster_pro.Infrastructure.Persistence.Contexts
{
    public class ApplicationDbContextFactory
        : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();
            basePath = Path.Combine(basePath, "..", "taskmaster-pro.WebApi");
            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .Build();

            var connectionString = config.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            var loggerFactory = LoggerFactory.Create(b => b.AddConsole());
            var dateTimeService = new DummyDateTimeService();

            return new ApplicationDbContext(
                optionsBuilder.Options,
                dateTimeService,
                loggerFactory);
        }

        private class DummyDateTimeService : IDateTimeService
        {
            public DateTime NowUtc => DateTime.UtcNow;
        }
    }
}
