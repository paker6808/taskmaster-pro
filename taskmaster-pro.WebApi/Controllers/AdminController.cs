using Features.Admin.Commands.ChangeUserRole;
using Microsoft.AspNetCore.Authorization;
using taskmaster_pro.Application.Features.Admin.Commands;
using taskmaster_pro.Application.Features.Admin.Commands.ResetSecurityAttempts;
using taskmaster_pro.Application.Features.Admin.Commands.UpdateUserRoles;
using taskmaster_pro.Application.Features.Admin.Queries.GetAdminUserById;
using taskmaster_pro.Application.Features.Admin.Queries.GetAllUsers;
using taskmaster_pro.Application.Features.Admin.Queries.GetPagedUsers;
using taskmaster_pro.Application.Features.Orders.Commands.DeleteOrder;
using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;
using taskmaster_pro.Application.Features.Schedules.Commands.DeleteSchedule;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = AuthorizationConsts.AdminPolicy)]
    public class AdminController : ControllerBase
    {
        #region Fields

        private readonly IMediator _mediator;

        #endregion

        #region Constructor

        public AdminController(IMediator mediator)
        {
            _mediator = mediator;
        }

        #endregion

        #region Public Methods

        // Returns all users for admin views
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _mediator.Send(new GetAllUsersQuery());
            return Ok(users);
        }

        // Returns a single user's full admin view
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var adminUser = await _mediator.Send(new GetAdminUserByIdQuery(id));
            if (adminUser == null)
                return NotFound();

            return Ok(adminUser);
        }

        // Returns a paged list of users
        [HttpPost("users/paged")]
        public async Task<IActionResult> GetPagedUsers([FromBody] GetPagedUsersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Changes roles for a given user
        [HttpPost("users/{userId}/roles")]
        public async Task<IActionResult> ChangeUserRoles(Guid userId, [FromBody] ChangeUserRolesCommand command)
        {
            command.UserId = userId;

            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Resets security-question attempt counters for the user
        [HttpPost("users/{userId}/reset-security-attempts")]
        public async Task<IActionResult> ResetSecurityAttempts(Guid userId)
        {
            await _mediator.Send(new ResetSecurityAttemptsCommand { UserId = userId });
            return NoContent();
        }

        // Updates user roles with validation
        [HttpPut("users/{userId}/roles")]
        public async Task<IActionResult> UpdateUserRoles(string userId, [FromBody] UpdateUserRolesCommand command)
        {
            if (userId != command.UserId)
                return BadRequest("User ID mismatch.");

            try
            {   
                await _mediator.Send(command);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        // Deletes a user
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            await _mediator.Send(new DeleteUserCommand { Id = id });
            return NoContent();
        }

        // Admin paged orders view (includes all fields for admin)
        [HttpPost("orders")]
        public async Task<IActionResult> GetPagedOrders([FromBody] PagedOrdersQuery query)
        {
            query.IncludeAllForAdmin = true;
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Deletes an order (admin)
        [HttpDelete("orders/{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            await _mediator.Send(new DeleteOrderCommand { Id = id });
            return NoContent();
        }

        // Admin paged schedules view (includes all fields for admin)
        [HttpPost("schedules")]
        public async Task<IActionResult> GetPagedSchedules([FromBody] PagedSchedulesQuery query)
        {
            query.IncludeAllForAdmin = true;
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Deletes a schedule (admin)
        [HttpDelete("schedules/{id}")]
        public async Task<IActionResult> DeleteSchedule(Guid id)
        {
            await _mediator.Send(new DeleteScheduleCommand { Id = id });
            return NoContent();
        }

        #endregion
    }
}