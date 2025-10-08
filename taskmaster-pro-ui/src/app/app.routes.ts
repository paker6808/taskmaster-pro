import { Routes } from '@angular/router';

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Dashboard
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

// Orders Feature
import { ListOrdersComponent } from './features/orders/list-orders/list-orders.component'
import { CreateOrderComponent } from './features/orders/create-order/create-order.component';
import { EditOrderComponent } from './features/orders/edit-order/edit-order.component';

// Schedules Feature
import { ListSchedulesComponent } from './features/schedules/list-schedules/list-schedules.component'
import { CreateScheduleComponent } from './features/schedules/create-schedule/create-schedule.component';
import { EditScheduleComponent } from './features/schedules/edit-schedule/edit-schedule.component';

// Auth Feature
import { LoginComponent } from './features/authentication/login/login.component';
import { RegisterComponent } from './features/authentication/register/register.component';
import { ForgotPasswordComponent } from './features/authentication/forgot-password/forgot-password.component';
import { StartComponent } from './features/authentication/security-question/start/start.component';
import { AnswerComponent } from './features/authentication/security-question/answer/answer.component';
import { ResetPasswordComponent } from './features/authentication/reset-password/reset-password.component';
import { ProfileComponent } from './features/authentication/profile/profile.component';
import { ChangePasswordComponent } from './features/authentication/change-password/change-password.component';
import { EmailConfirmationComponent } from './features/authentication/email-confirmation/email-confirmation.component';

// Guards
import { AuthGuard } from './features/authentication/guards/auth.guard';
import { SecurityQuestionGuard } from './features/authentication/guards/security-question.guard';
import { ResetPasswordGuard } from './features/authentication/guards/reset-password.guard';
import { AdminGuard } from './features/authentication/guards/admin.guard';

// Unauthorized access
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

// Admin Feature
import { UserListComponent } from './features/admin/user-list/user-list.component';
import { UserDetailComponent } from './features/admin/user-detail/user-detail.component';
import { ListAllOrdersComponent } from './features/admin/list-all-orders/list-all-orders.component';
import { OrderDetailComponent } from './features/admin/order-detail/order-detail.component'
import { ListAllSchedulesComponent } from './features/admin/list-all-schedules/list-all-schedules.component';
import { ScheduleDetailComponent } from './features/admin/schedule-detail/schedule-detail.component';

// Fallback
import { NotFoundComponent }   from './shared/components/not-found/not-found.component';

// Main application routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ────────────────────────── PUBLIC ROUTES ─────────────────────────────
      // These pages do not require authentication:
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'security-question/start', component: StartComponent },
      {
        path: 'security-question/answer',
        component: AnswerComponent,
        canActivate: [SecurityQuestionGuard]
      },
      { 
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [ResetPasswordGuard]
      },

      // Email confirmation page
      { path: 'email-confirmation', component: EmailConfirmationComponent },

      // ───────────────────────── PROTECTED ROUTES ───────────────────────────
      // All of these require a valid JWT, enforced by AuthGuard:
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },

      // Orders CRUD:
      {
        path: 'orders',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ListOrdersComponent },
          { path: 'create', component: CreateOrderComponent },
          { path: 'edit/:id', component: EditOrderComponent },
        ]
      },

      // Schedules CRUD:
      {
        path: 'schedules',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: ListSchedulesComponent },
          { path: 'create', component: CreateScheduleComponent },
          { path: 'edit/:id', component: EditScheduleComponent },
        ]
      },

      // User profile:
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },

      // Change password:
      {
        path: 'profile/change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
      },

      // ─────────────────────────── UNAUTHORIZED ROUTE ───────────────────────────
      // This route is for unauthorized access, e.g. when a user
      // tries to access admin pages without proper permissions:
      { path: 'unauthorized', component: UnauthorizedComponent },

      // ─────────────────────────── ADMIN ROUTES ─────────────────────────────
      {
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard],
        children: [
          // Users
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', component: UserListComponent },
          { path: 'users/:id', component: UserDetailComponent },

           // Orders
          { path: 'orders', component: ListAllOrdersComponent },
          { path: 'orders/:id', component: OrderDetailComponent },

          // Schedules
          { path: 'schedules', component: ListAllSchedulesComponent },
          { path: 'schedules/:id', component: ScheduleDetailComponent }
        ]
      },

      // ─────────────────────────── FALLBACK ROUTE ───────────────────────────
      // If no other route matched, show a 404 page:
      { path: '**', component: NotFoundComponent }
    ]
  }
];