namespace taskmaster_pro.Application.Common
{
    public class OperationResult
    {
        public bool Succeeded { get; set; }
        public IList<string> Errors { get; set; } = new List<string>();

        public static OperationResult Success() => new OperationResult { Succeeded = true };
        public static OperationResult Fail(params string[] errors) =>
            new OperationResult { Succeeded = false, Errors = errors.ToList() };
    }
}
