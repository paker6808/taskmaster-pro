using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;

internal static class ApplicationDbContextHelpers
{
    /// <summary>
    /// Configures the model builder for the application database context.
    /// </summary>
    /// <param name="modelBuilder">The model builder.</param>
    public static void DatabaseModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureOrderEntity(modelBuilder);
        ConfigureScheduleBaseEntity(modelBuilder);
        ConfigureScheduleEntity(modelBuilder);
    }

    /// <summary>
    /// Configures the Order entity in the model builder.
    /// </summary>
    private static void ConfigureOrderEntity(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<Order>();

        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).HasDefaultValueSql("newsequentialid()");

        entity.Property(e => e.CustomerName)
              .IsRequired()
              .HasMaxLength(250);

        entity.Property(e => e.OrderDate)
              .IsRequired();

        entity.Property(e => e.Status)
              .HasConversion<string>()
              .HasMaxLength(50)
              .IsRequired();

        entity.Property(e => e.TotalAmount)
              .HasColumnType("decimal(18,2)")
              .IsRequired();

        entity.Property(e => e.UserId)
              .IsRequired()
              .HasMaxLength(450);

        entity.HasOne<ApplicationUser>()
              .WithMany()
              .HasForeignKey(e => e.UserId)
              .OnDelete(DeleteBehavior.Restrict);

        entity.Property(e => e.Created)
              .IsRequired();

        entity.Property(e => e.CreatedBy)
              .HasMaxLength(100)
              .IsRequired();

        entity.Property(e => e.UpdatedBy)
              .HasMaxLength(100);

        entity.HasMany(e => e.Schedules)
              .WithOne(s => s.Order)
              .HasForeignKey(s => s.OrderId)
              .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureScheduleBaseEntity(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<Schedule>();

        // Configure PK + auto GUID
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id)
              .HasDefaultValueSql("newsequentialid()");

        // Explicitly map to table (prevents EF guessing)
        entity.ToTable("Schedules");
    }


    /// <summary>
    /// Configures the Schedule entity in the model builder.
    /// </summary>
    private static void ConfigureScheduleEntity(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<ScheduleEntity>();

        entity.Property(e => e.ScheduledStart).IsRequired();
        entity.Property(e => e.ScheduledEnd).IsRequired();

        entity.Property(e => e.AssignedToId)
            .IsRequired(false)
            .HasMaxLength(450);

        entity.HasOne(e => e.AssignedTo)
          .WithMany()
          .HasForeignKey(e => e.AssignedToId)
          .OnDelete(DeleteBehavior.Restrict);

        entity.Property(e => e.Description).HasMaxLength(1000);

        entity.Property(e => e.UserId)
              .IsRequired()
              .HasMaxLength(450);

        entity.HasOne(e => e.User)
              .WithMany()
              .HasForeignKey(e => e.UserId)
              .OnDelete(DeleteBehavior.Restrict);

        entity.Property(e => e.Title)
              .IsRequired()
              .HasMaxLength(250);

        entity.Property(e => e.Created).IsRequired();
        entity.Property(e => e.CreatedBy).HasMaxLength(100).IsRequired();
        entity.Property(e => e.UpdatedBy).HasMaxLength(100);
    }
}