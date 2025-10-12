using Microsoft.EntityFrameworkCore.Design;
using System.IO;   
using System.Xml.Linq;

namespace taskmaster_pro.Infrastructure.Persistence.Contexts
{
    public class ApplicationDbContextFactory
        : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Point to WebApi project config
            var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "taskmaster-pro.WebApi"));

            // Build config from appsettings and env
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: false);
                //.AddEnvironmentVariables();

            // Try to read UserSecretsId from WebApi .csproj and add user secrets if present
            try
            {
                var csprojPath = Path.Combine(basePath, "taskmaster-pro.WebApi.csproj");
                if (File.Exists(csprojPath))
                {
                    var xdoc = XDocument.Load(csprojPath);
                    var userSecretsId = xdoc.Descendants().FirstOrDefault(n => n.Name.LocalName == "UserSecretsId")?.Value;
                    if (!string.IsNullOrWhiteSpace(userSecretsId))
                    {
                        // Locate secrets.json on disk where dotnet user-secrets stores it
                        string secretsPath = GetUserSecretsFilePath(userSecretsId);
                        if (!string.IsNullOrWhiteSpace(secretsPath) && File.Exists(secretsPath))
                        {
                            configurationBuilder.AddJsonFile(secretsPath, optional: true, reloadOnChange: false);
                        }
                    }
                }
            }
            catch
            {
                // Swallow - user secrets are optional and this should never be fatal here
            }

            var config = configurationBuilder.Build();

            // Get connection string from configuration sources (user-secrets, appsettings, environment)
            var connectionString = config.GetConnectionString("DefaultConnection")
                                   ?? Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

            // If not present — fail fast and explain how to supply it (no hardcoded fallback)
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "No connection string found for 'DefaultConnection'. Provide it via one of:\n" +
                    "  * WebApi/appsettings.Development.json => ConnectionStrings:DefaultConnection\n" +
                    "  * WebApi user-secrets: run (in the WebApi folder):\n" +
                    "      dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" \"<connection-string>\"\n" +
                    "  * Environment variable: ConnectionStrings__DefaultConnection\n\n" +
                    "Example LocalDB value:\n" +
                    "  Data Source=(localdb)\\\\MSSQLLocalDB;Initial Catalog=taskmaster-proDb;Integrated Security=True;MultipleActiveResultSets=True;"
                );
            }

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            var loggerFactory = LoggerFactory.Create(b => b.AddConsole());
            var dateTimeService = new DummyDateTimeService();

            return new ApplicationDbContext(
                optionsBuilder.Options,
                dateTimeService,
                loggerFactory);
        }

        private static string GetUserSecretsFilePath(string userSecretsId)
        {
            if (string.IsNullOrWhiteSpace(userSecretsId)) return null;

            // Windows path: %APPDATA%\Microsoft\UserSecrets\<id>\secrets.json
            // Linux/macOS path: ~/.microsoft/usersecrets/<id>/secrets.json
            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData); // %APPDATA%
                var p = Path.Combine(appData, "Microsoft", "UserSecrets", userSecretsId, "secrets.json");
                return p;
            }
            else
            {
                // POSIX (Linux / macOS)
                var home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                var p = Path.Combine(home, ".microsoft", "usersecrets", userSecretsId, "secrets.json");
                return p;
            }
        }

        private class DummyDateTimeService : IDateTimeService
        {
            public DateTime NowUtc => DateTime.UtcNow;
        }
    }
}
