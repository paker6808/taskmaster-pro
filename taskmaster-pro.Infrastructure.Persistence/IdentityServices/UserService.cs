using AutoMapper;
using Features.Users.ViewModels;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using taskmaster_pro.Application.Exceptions;
using taskmaster_pro.Application.Features.Admin.Queries.GetPagedUsers;
using taskmaster_pro.Application.Features.Admin.ViewModels;
using taskmaster_pro.Application.Features.Users.DTOs;
using taskmaster_pro.Infrastructure.Persistence.Contexts.Entities;
using ValidationException = taskmaster_pro.Application.Exceptions.ValidationException;

namespace taskmaster_pro.Infrastructure.Persistence.IdentityServices
{
    public class UserService : IUserService
    {
        #region Fields

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _dbContext;

        #endregion

        #region Constructor

        public UserService(
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _dbContext = dbContext;
        }

        #endregion

        #region Public Methods

        public async Task<bool> UserExistsAsync(Guid userId)
        {
            return await _dbContext.Users.AnyAsync(u => u.Id == userId.ToString() && !u.IsDeleted);
        }

        public async Task<IEnumerable<UserViewModel>> GetAllUsersAsync()
        {
            var users = await _userManager.Users
                .Where(u => !u.IsDeleted)
                .ToListAsync();

            var userViewModels = new List<UserViewModel>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var vm = _mapper.Map<UserViewModel>(user);
                vm.Roles = roles.ToList();
                userViewModels.Add(vm);
            }

            return userViewModels;
        }

        public async Task<List<UserDto>> SearchUsersAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<UserDto>();

            var qLower = query.ToLower();

            var users = await _dbContext.Users
                .Where(u =>
                    !u.IsDeleted &&
                    ((u.Email != null && u.Email.ToLower().Contains(qLower)) ||
                    (u.FirstName != null && u.FirstName.ToLower().Contains(qLower)) ||
                    (u.LastName != null && u.LastName.ToLower().Contains(qLower)) ||
                    (u.FirstName + " " + u.LastName).ToLower().Contains(qLower))
                )
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .Take(20)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    DisplayName = (u.FirstName + " " + u.LastName).Trim(),
                    Email = u.Email
                })
                .ToListAsync();

            return users;
        }

        public async Task<UserViewModel> GetUserByIdAsync(Guid userId)
        {
            var user = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId.ToString());

            if (user == null)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            return _mapper.Map<UserViewModel>(user);
        }

        public async Task<AdminUserViewModel> GetAdminUserByIdAsync(Guid userId)
        {
            // Fetch user from the DB
            var user = await _dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId.ToString());

            if (user == null)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            // Map basic fields using AutoMapper
            var adminUser = _mapper.Map<AdminUserViewModel>(user);
            adminUser.IsDeleted = user.IsDeleted;

            // Populate extra fields manually
            var roles = await _dbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Join(_dbContext.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)
                .ToListAsync();

            adminUser.Roles = roles;
            adminUser.SecurityQuestion = user.SecurityQuestion;
            adminUser.FailedSecurityQuestionAttempts = user.FailedSecurityQuestionAttempts;
            if (user.SecurityQuestionLockoutEnd.HasValue && user.SecurityQuestionLockoutEnd > DateTime.UtcNow)
            {
                adminUser.LockoutEndMinutesRemaining = (user.SecurityQuestionLockoutEnd.Value - DateTime.UtcNow).TotalMinutes;
            }

            return adminUser;
        }

        public async Task<List<string>> GetRolesAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            var roles = await _userManager.GetRolesAsync(user);
            return roles.ToList();
        }

        public async Task<(IEnumerable<UserViewModel> Users, int TotalRecords)> GetPagedUsersAsync(
            GetPagedUsersQuery request,
            CancellationToken cancellationToken = default)
        {
            // Defensive defaults
            request.PageNumber = request.PageNumber > 0
                ? request.PageNumber
                : ((request.Start > 0 && request.Length > 0) ? (request.Start / request.Length) + 1 : 1);
            request.PageSize = request.PageSize > 0
                ? request.PageSize
                : (request.Length > 0 ? request.Length : 10);

            int skip = request.Start;
            int take = request.Length > 0 ? request.Length : request.PageSize;

            // Base query on the view
            var query = _dbContext.UserRolesView
                .AsNoTracking()
                .Where(u => !u.IsDeleted)
                .AsQueryable();

            // Total records
            var totalRecords = await _dbContext.UserRolesView
                .AsNoTracking()
                .CountAsync(u => !u.IsDeleted, cancellationToken);

            // --- ORDERING ---
            string orderColumn = null;
            string orderDir = "asc";

            if (request.Order?.Any() == true && request.Columns != null && request.Columns.Count > 0)
            {
                var ord = request.Order[0];
                if (ord != null && ord.Column >= 0 && ord.Column < request.Columns.Count)
                {
                    orderColumn = request.Columns[ord.Column].Data;
                    orderDir = (ord.Dir ?? "asc").ToLowerInvariant();
                }
            }

            if (!string.IsNullOrWhiteSpace(orderColumn))
            {
                switch (orderColumn.ToLowerInvariant())
                {
                    case "role":
                        if (orderDir == "desc")
                        {
                            // Descending: multi-role first, then by priority desc
                            query = query
                                .OrderByDescending(u => u.RoleCount <= 1 ? 0 : 1)
                                .ThenByDescending(u => u.HighestRolePriority)
                                .ThenByDescending(u => u.RoleCount)
                                .ThenByDescending(u => u.FirstName)
                                .ThenByDescending(u => u.LastName);
                        }
                        else
                        {
                            // Ascending: single-role first, then by priority asc
                            query = query
                                .OrderBy(u => u.RoleCount <= 1 ? 0 : 1)
                                .ThenBy(u => u.HighestRolePriority)
                                .ThenBy(u => u.RoleCount)
                                .ThenBy(u => u.FirstName)
                                .ThenBy(u => u.LastName);
                        }
                        break;

                    case "fullname":
                        query = orderDir == "desc"
                            ? query.OrderByDescending(u => u.FirstName).ThenByDescending(u => u.LastName)
                            : query.OrderBy(u => u.FirstName).ThenBy(u => u.LastName);
                        break;

                    case "email":
                        query = orderDir == "desc" ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email);
                        break;

                    case "firstname":
                        query = orderDir == "desc" ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName);
                        break;

                    case "lastname":
                        query = orderDir == "desc" ? query.OrderByDescending(u => u.LastName) : query.OrderBy(u => u.LastName);
                        break;

                    case "id":
                        query = orderDir == "desc" ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id);
                        break;

                    default:
                        query = query.OrderBy(u => u.Email);
                        break;
                }
            }
            else
            {
                // Default ordering: single-role first, then by priority
                query = query
                    .OrderBy(u => u.RoleCount <= 1 ? 0 : 1)
                    .ThenBy(u => u.HighestRolePriority)
                    .ThenBy(u => u.RoleCount)
                    .ThenBy(u => u.FirstName)
                    .ThenBy(u => u.LastName);
            }

            // --- PAGING ---
            var pageItems = await query
                .Skip(skip)
                .Take(take)
                .ToListAsync(cancellationToken);

            // --- MAP TO VIEWMODEL ---
            var resultList = pageItems.Select(u => new UserViewModel
            {
                Id = Guid.Parse(u.Id),
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Roles = string.IsNullOrWhiteSpace(u.Roles)
                    ? new List<string>()
                    : u.Roles.Split(", ").ToList()
            }).ToList();

            return (resultList, totalRecords);
        }

        public async Task ChangeUserRolesAsync(Guid userId, List<string> roles)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            // Get current roles
            var currentRoles = (await _userManager.GetRolesAsync(user)).ToList();

            // Prevent removing the last Admin
            if (currentRoles.Contains("Admin") && !roles.Contains("Admin"))
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                if (admins.Count == 1 && admins.First().Id == user.Id)
                    throw new InvalidOperationException("Cannot remove the last Admin.");
            }

            // Remove roles that are no longer needed
            var rolesToRemove = currentRoles.Except(roles).ToList();
            if (rolesToRemove.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                    throw new Exception($"Failed to remove roles for user {userId}");
            }

            // Add new roles
            var rolesToAdd = roles.Except(currentRoles).ToList();
            if (rolesToAdd.Any())
            {
                var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                    throw new Exception($"Failed to add roles '{string.Join(", ", rolesToAdd)}' to user {userId}");
            }

            // Fallback role if user somehow has no roles
            var finalRoles = await _userManager.GetRolesAsync(user);
            if (!finalRoles.Any())
                await _userManager.AddToRoleAsync(user, "User");
        }

        public async Task ResetSecurityAttemptsAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            user.FailedSecurityQuestionAttempts = 0;
            user.SecurityQuestionLockoutEnd = null;
            await _userManager.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.IsDeleted)
                throw new NotFoundException(nameof(ApplicationUser), userId);

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (!result.Succeeded)
            {
                var failures = result.Errors
                    .Select(e => new ValidationFailure("", e.Description));
                throw new ValidationException(failures);
            }
        }

        public async Task UpdateUserAsync(UserViewModel user)
        {
            var appUser = await _userManager.FindByIdAsync(user.Id.ToString());
            if (appUser == null || appUser.IsDeleted)
                throw new NotFoundException("User", user.Id);

            appUser.FirstName = user.FirstName;
            appUser.LastName = user.LastName;
            appUser.Email = user.Email;

            var result = await _userManager.UpdateAsync(appUser);

            if (!result.Succeeded)
            {
                var failures = result.Errors.Select(e => new ValidationFailure("", e.Description));
                throw new ValidationException(failures);
            }
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // Get the user
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || user.IsDeleted)
                    throw new NotFoundException(nameof(ApplicationUser), userId);

                // Delete schedules created to AND assigned to the user
                var schedules = _dbContext.Schedules.Where(s => s.UserId == user.Id && s.AssignedToId == user.Id);
                _dbContext.Schedules.RemoveRange(schedules);

                // Delete orders linked to the user (if any)
                var orders = _dbContext.Orders.Where(o => o.UserId == user.Id);
                _dbContext.Orders.RemoveRange(orders);

                await _dbContext.SaveChangesAsync();

                // Now update the user by setting soft-delete flag
                user.IsDeleted = true;
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                    throw new Exception($"Failed to delete user {userId}: {string.Join(", ", result.Errors.Select(e => e.Description))}");

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Failed to delete user {userId} and related entities: {ex.Message}", ex);
            }
        }

        public async Task<int> GetTotalUsersAsync(bool confirmedOnly = true)
        {
            if (confirmedOnly)
                return await _dbContext.Users.CountAsync(u => u.EmailConfirmed && !u.IsDeleted);

            return await _dbContext.Users.CountAsync(u => !u.IsDeleted);
        }

        #endregion
    }
}
