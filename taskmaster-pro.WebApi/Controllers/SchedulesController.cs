using Microsoft.AspNetCore.Authorization;
using taskmaster_pro.Application.Features.Schedules.Commands.CreateSchedule;
using taskmaster_pro.Application.Features.Schedules.Commands.DeleteSchedule;
using taskmaster_pro.Application.Features.Schedules.Commands.UpdateSchedule;
using taskmaster_pro.Application.Features.Schedules.Queries.GetScheduleById;
using taskmaster_pro.Application.Features.Schedules.Queries.PagedSchedules;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SchedulesController : ControllerBase
    {
        #region Fields

        private readonly IMediator _mediator;

        #endregion

        #region Constructor

        public SchedulesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        #endregion

        #region Public Methods

        // Returns all schedules
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetSchedulesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Returns a paged list of schedules
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] PagedSchedulesQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Returns a schedule by ID
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetScheduleByIdQuery { Id = id });
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Creates a new schedule
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateScheduleCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        // Updates an existing schedule
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateScheduleCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }

        // Deletes a schedule
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteScheduleCommand { Id = id });
            return NoContent();
        }

        #endregion
    }
}