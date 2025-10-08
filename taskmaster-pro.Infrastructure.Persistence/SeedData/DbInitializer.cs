namespace taskmaster_pro.Infrastructure.Persistence.SeedData
{
    /// <summary>
    /// Static class for seeding mock data into the database.
    /// </summary>
    public static class DbInitializer
    {
        /// <summary>
        /// Seeds mock data into the database.
        /// </summary>
        /// <param name="dbContext">The application's database context.</param>
        public static async Task SeedDataAsync(ApplicationDbContext dbContext)
        {
            var seeder = new DatabaseSeeder(dbContext);

            await seeder.GenerateAndSeedAsync(
               rowOrders: 50,
               rowSchedules: 200,
               seed: 2000,
               wipeExisting: true
           );
        }
    }
}
