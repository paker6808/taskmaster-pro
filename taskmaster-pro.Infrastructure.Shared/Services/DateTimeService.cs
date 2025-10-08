namespace taskmaster_pro.Infrastructure.Shared.Services
{
    public class DateTimeService : IDateTimeService
    {
        // The current date and time in UTC
        public DateTime NowUtc => DateTime.UtcNow;
    }
}