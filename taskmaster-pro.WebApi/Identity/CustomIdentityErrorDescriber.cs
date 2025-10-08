using Microsoft.AspNetCore.Identity;

namespace taskmaster_pro.WebApi.Identity
{
    public class CustomIdentityErrorDescriber : IdentityErrorDescriber
    {
        public override IdentityError PasswordTooShort(int length) =>
            new IdentityError
            {
                Code = nameof(PasswordTooShort),
                Description = $"Your password must be at least {length} characters long."
            };

        public override IdentityError PasswordRequiresDigit() =>
            new IdentityError
            {
                Code = nameof(PasswordRequiresDigit),
                Description = "Your password must contain at least one numeric digit (0–9)."
            };

        public override IdentityError PasswordRequiresLower() =>
            new IdentityError
            {
                Code = nameof(PasswordRequiresLower),
                Description = "Your password must contain at least one lowercase letter (a–z)."
            };

        public override IdentityError PasswordRequiresUpper() =>
            new IdentityError
            {
                Code = nameof(PasswordRequiresUpper),
                Description = "Your password must contain at least one uppercase letter (A–Z)."
            };
    }
}
