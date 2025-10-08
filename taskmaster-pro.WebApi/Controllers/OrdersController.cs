using Features.Orders.Commands.CreateOrder;
using Microsoft.AspNetCore.Authorization;
using taskmaster_pro.Application.Features.Orders.Commands.DeleteOrder;
using taskmaster_pro.Application.Features.Orders.Commands.UpdateOrder;
using taskmaster_pro.Application.Features.Orders.Queries.GetOrderById;
using taskmaster_pro.Application.Features.Orders.Queries.OrderExists;
using taskmaster_pro.Application.Features.Orders.Queries.PagedOrders;
using taskmaster_pro.Application.Features.Orders.Queries.SearchOrders;
using taskmaster_pro.Domain.Entities;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        #region Fields

        private readonly IMediator _mediator;

        #endregion

        #region Constructor

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        #endregion

        #region Public Methods

        // Returns all orders
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetOrdersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Returns a paged list of orders
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] PagedOrdersQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Returns an order by ID
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetOrderByIdQuery { Id = id });
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Searches orders by query term
        [HttpGet("search")]
        public async Task<ActionResult<List<Order>>> SearchOrders([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<Order>());

            var result = await _mediator.Send(new SearchOrdersQuery(q));
            return Ok(result);
        }

        // Checks if an order exists
        [HttpGet("{id}/exists")]
        public async Task<ActionResult<bool>> Exists(string id)
        {
            if (!Guid.TryParse(id, out var guid))
                return Ok(false);

            var exists = await _mediator.Send(new OrderExistsQuery(guid));
            return Ok(exists);
        }

        // Creates a new order
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        // Updates an existing order
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOrderCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }

        // Deletes an order
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteOrderCommand { Id = id });
            return NoContent();
        }

        #endregion
    }
}