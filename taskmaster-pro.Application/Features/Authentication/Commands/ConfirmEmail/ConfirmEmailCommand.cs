namespace taskmaster_pro.Application.Features.Authentication.Commands.ConfirmEmail
{
    public class ConfirmEmailCommand : IRequest<ConfirmEmailResult>
    {
        public string UserId { get; set; } = default!;
        public string Token { get; set; } = default!;
    }

    public class ConfirmEmailResult
    {
        public bool Succeeded { get; set; }
        public string? Message { get; set; }
    }
}
