# TaskmasterPro – Full-Stack Portfolio Project

TaskmasterPro is a modern task and scheduling management application, featuring a rich Angular front end and a robust .NET 9.0 WebAPI back end. The API is built with ASP.NET Core 9 and follows a clean, Onion (DDD-inspired) architecture: the Domain layer defines entities (Orders, Schedules, etc.); the Application layer implements CQRS with MediatR, FluentValidation, and AutoMapper for clean separation of concerns; and the Infrastructure layer handles persistence and external integrations. The front end is an Angular 20 app using Angular Material for a polished UI, complete with responsive design, charts, and secure authentication.

---

## Backend (TaskmasterPro API)

**Framework:** The backend runs on .NET 9.0 (the latest .NET release)[1], using ASP.NET Core Web API. It exposes RESTful endpoints for managing orders, schedules, and user accounts. All data access is code-first with Entity Framework Core (EF Core 9) and SQL Server. The database schema is managed via EF migrations (with custom tables/views like user-role views) and seeded with initial data (including an administrator account) using libraries like AutoBogus.

**Architecture & Patterns:** The project uses the Onion/Clean Architecture pattern. Business logic lives in the Application layer, which uses MediatR (a simple in-process mediator library)[2] to implement CQRS (commands/queries) and notifications. Entities and DTOs are defined in Domain and Application layers. I also implemented repository and service layers for data access (e.g. generic repositories, custom Schedule/Order repositories, User/Authentication services) to encapsulate the EF logic. Object mapping between entities and DTOs is handled by AutoMapper[3], which maps complex models to flat DTOs by convention. Input validation uses FluentValidation[4], allowing me to express validation rules (e.g. required fields, formats) in a fluent, strongly-typed way.

**Authentication & Security:** User accounts leverage ASP.NET Core Identity (with custom ApplicationUser extending IdentityUser) for robust authentication. I require email confirmation and strong passwords (min 8 chars with mixed case and digits). All API endpoints use JWT (JSON Web Tokens) for stateless auth – after login the client gets a signed JWT, which is included in requests. JWT is an industry-standard token format for secure information exchange[5]. I enforce role-based authorization: users can have User or Admin roles (defined in configuration). Admin-only controllers (like AdminController) are protected by `[Authorize(Roles="Admin")]`. Additionally, Google reCAPTCHA (v3 with occasional challenge prompts) is integrated on all forms that change state (registration, password reset) to prevent bots – normally invisible, but sometimes users must complete a visual challenge.

**External Services:** The API sends email notifications (e.g. confirmations, password resets) through SendGrid on production (for development it uses SMTP). This integrates via the SendGrid .NET library, using SMTP/API settings from configuration. User sessions are cached in Redis (StackExchange.Redis) for distributed session support – Redis is an in-memory store often used for caching/scalable session state[7]. Application configuration (like JWT secret, email SMTP settings, reCAPTCHA secret) is managed via `appsettings.json` and environment variables. Logging is handled by Serilog, writing to console and rolling log files (in a `/Logs` directory).

**API Features:** Key backend features include:
- **User Management:** Register, email-confirm, login, password reset (with security question and reCAPTCHA), profile update, change password, delete account (soft delete). Admins can list users, change roles, and unlock locked accounts.
- **Orders & Schedules:** CRUD operations for Orders and Schedules, with ordering and pagination. Each order must have an assigned schedule. Schedules include date/time and assigned user (which for regular users is the same user that created the schedule, while admins can assign any other existing and non-deleted user).
- **Security Hardening:** Custom exception middleware returns standard error responses on failure. Sensitive fields (passwords, security answers) are hashed. Identity tables have added fields (SecurityQuestion/AnswerHash, lockout fields). I also add `IsDeleted` flags for soft deletes. Database views (`vw_UserRoles` etc.) aggregate user-role info for reporting.
- **Testing & Quality:** While not including a separate test project in this repo, the design emphasizes testability (dependencies injected via DI, MediatR handlers, clean layering). Static analysis and code reviews ensure quality.

**Getting Started – Backend:** To run the API locally, you need .NET 9 SDK and SQL Server (or LocalDB). Key steps:
1. **Configure:** Copy secrets.example.json to secrets.json in the project root in the `taskmaster-pro.WebApi` project and fill in your local credentials. Required keys include: JWT settings, reCAPTCHA secret, SMTP and SendGrid mail settings, Redis connection, STS Server URL, admin user password, and database connection string (ConnectionStrings:DefaultConnection). The example file contains placeholder values so you can run the project locally without exposing real secrets.
2. **Database Migrations:** The app automatically applies migrations at startup via `db.Database.Migrate()` in `Program.cs`. Alternatively, to create/update the schema manually run the following from the `taskmaster-pro.WebApi` folder:

   ```powershell
   dotnet ef database update --project ..\taskmaster-pro.Infrastructure.Persistence\
   ```
3. **Run:** Use `dotnet run` in the WebApi project. Swagger UI is enabled – navigate to `https://localhost:<port>/swagger` to explore endpoints. The API logs to console and the `Logs` folder.
4. **Seeding:** On first run, an admin user is seeded (email: `admin@example.com`). Check console logs for the temp password. Admin can change it via the UI or API.

✅ v1.0.1 update: The database now auto-creates on first run; no manual `dotnet ef database update` is required for local setup.

**Tech Stack – Backend:** .NET 9.0 (ASP.NET Core), C#, Entity Framework Core (Code-First) with SQL Server, MediatR (CQRS), AutoMapper, FluentValidation, ASP.NET Identity (customized), JWT authentication, StackExchange.Redis (caching), Serilog (logging), Swashbuckle/Swagger, AutoBogus (data seeding), and custom Middleware/Filters. The solution is structured into Projects (`.Application`, `.Domain`, `.Infrastructure`, `.WebApi`) illustrating Onion architecture for maintainability and testability.

---

## Frontend (TaskmasterPro UI)

**Framework:** The front end is built with Angular 20 (generated via Angular CLI 20.0.0). It is a Single-Page Application (SPA) that communicates with the backend API for all data. The UI is responsive and mobile-friendly, with a clean layout: a top toolbar and a side navigation menu that can be collapsed or expanded via a toggle (automatically collapsed on small screens but user-controllable on all screen sizes).

**UI Components:** I use Angular Material (Google’s Material Design library) for consistent, high-quality UI widgets[8]. The app has custom themes and global SCSS styles for branding. Reusable components include forms (login, register, profiles), data tables for lists (with pagination and sorting), charts for the dashboard, dialogs, and feedback toasts. Notable features:
- **Authentication Forms:** Standalone, responsive forms for Login, Register, Forgot/Reset Password, and Change Password. Each form has client-side validation (via Angular Reactive Forms and custom validators) and helpful error messages. The Register form and Reset password form include a password strength meter (a Material progress bar) that dynamically evaluates the strength of the entered password. All state-changing auth forms (register, password reset/change) include Google reCAPTCHA v3 widgets (ng-recaptcha) for spam protection – tokens are sent to the API for validation.
- **Password Visibility:** Password inputs have a toggle icon to show/hide characters, improving UX on mobile and helping avoid typos.
- **Dashboard:** A landing dashboard (protected by login) shows quick stats (total orders, schedules, users) in cards, and an orders/schedules chart. I use ng2-charts (Chart.js) for the bar chart of monthly activity, demonstrating data visualization[2]. The dashboard shows a spinner while loading.
- **Navigation:** The app has a main layout with a toolbar (app title, user menu/logout) and a side nav for routing between features. Routes are protected by auth guards. I also include “Not Found” (404) and “Unauthorized” (403) pages as standalone components, linked via routing for invalid or forbidden access.
- **Admin Section:** If the user has an Admin role, additional menu items appear. Admins can manage all users (change roles, reset failed attempts), and view list/detail of all orders and schedules, not just their own.

**State & Services:** Shared Angular services handle API calls (e.g. `AuthService`, `OrderService`, `ScheduleService`, `DashboardService`). I maintain global application state (e.g. current user profile) via simple service patterns. The code is organized into feature modules (e.g. `AuthenticationModule`, `AdminModule`, `DashboardModule`, `OrdersModule`, etc.) and shared modules for Material imports and utilities. I use Angular InjectionTokens for configuration (e.g. pagination options).

**Styling & Assets:** Custom global SCSS and Angular Material theming provide a professional look. The app includes a custom favicon and consistent branding colors. All layouts are designed mobile-first, adjusting to various screen sizes (e.g. form width, margins via media queries).

**Testing:** The front-end includes extensive unit tests (using Jasmine/Karma) with 47 specs covering components, services, guards, utils, modules and validators. I focus on core functionality rather than trying to hit 100% coverage. Current test coverage is ~83% (statements) with all main paths verified. These tests serve as documentation of component behavior and help ensure stability during refactoring. (To run tests: `ng test --code-coverage`, which also generates coverage reports.)

![Test Coverage](docs/coverage-screenshot.png)

### ✅ Test Coverage All frontend unit tests executed successfully.

**Results:** 350 specs, all passing (100% success)
**Coverage:** 82.27% Statements (1448/1760) | 57.96% Branches (324/559) | 86.8% Functions (434/500) | 83.75% Lines (1397/1668)

**Getting Started – Frontend:** To launch the UI locally:
1. **Install Dependencies:**
- Using npm: `npm install --legacy-peer-deps` (necessary due to peer dependency conflict in ng-recaptcha)  
- Using yarn: `yarn install`
2. **Configure API URL:** The Angular environment files already point to `https://localhost:44378/api` (or use your backend URL). Adjust `environment.ts` if needed.
3. **Run Dev Server:** Execute `ng serve`. Then open `http://localhost:4200/` in a browser. The app will hot-reload on code changes.
4. **Build for Production:** Run `ng build` to produce optimized assets in `dist/`. The production build is AOT-compiled and minified.

**Tech Stack – Frontend:** Angular 20 (TypeScript), Angular Material components[8], ng2-charts (Chart.js), ng-recaptcha (Google reCAPTCHA v3), RxJS, and SASS for styling. I use Angular CLI tooling and standard Angular best practices for reactivity.

**Testing & Quality:** The UI code follows best practices for modular Angular apps. I employ Angular Reactive Forms with strict typing, custom pipes for any formatting (e.g. date helpers), and consistent error handling. The code is linted and formatted via Angular CLI standards.

---

## Additional Notes

- **Deployment:** The API can be hosted on any .NET-compatible host. I use the free tier of Azure App Service for demonstration (Azure offers always-free hosting options for small apps[9]). The Angular app can be built and served via Azure Static Web Apps or any static hosting. (No custom domain is needed for dev; you can point DNS later if desired.)
- **Documentation:** Swagger (OpenAPI) is integrated – after running the API, the Swagger UI is available at `/swagger`. This documents all endpoints, request/response models, and authentication schemes.
- **Future Work:** Features like email templates (with SendGrid), additional user roles, and enhanced error logging are all structured in so they can be extended. The architecture easily allows adding new modules (e.g. a messaging system or another entity) by following the existing patterns.

---

In summary, TaskmasterPro demonstrates a full-stack implementation with current technologies: modern Angular on the front end with Material design and a responsive layout; and a secure, well-structured .NET 9 backend with EF Core, clean architecture (CQRS/Mediator, Onion architecture layered projects), and integration of third-party services (JWT auth, reCAPTCHA, SendGrid email, Redis caching). These choices highlight professional-level skills in designing scalable, maintainable applications.

---

[1] .NET - Wikipedia  
https://en.wikipedia.org/wiki/.NET

[2] GitHub - LuckyPennySoftware/MediatR: Simple, unambitious mediator implementation in .NET  
https://github.com/LuckyPennySoftware/MediatR

[3] AutoMapper: The Object-Object Mapper - AutoMapper  
https://automapper.io/

[4] GitHub - FluentValidation/FluentValidation: A popular .NET validation library for building strongly-typed validation rules.  
https://github.com/FluentValidation/FluentValidation

[5] JSON Web Tokens  
https://auth0.com/docs/secure/tokens/json-web-tokens

[6] reCAPTCHA  |  Google for Developers  
https://developers.google.com/recaptcha

[7] Redis: What It Is, What It Does, and Why You Should Care | Backendless  
https://backendless.com/redis-what-it-is-what-it-does-and-why-you-should-care/

[8] GitHub - angular/components: Component infrastructure and Material Design components for Angular  
https://github.com/angular/components

[9] Explore Free Azure Services | Microsoft Azure  
https://azure.microsoft.com/en-us/pricing/free-services

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
