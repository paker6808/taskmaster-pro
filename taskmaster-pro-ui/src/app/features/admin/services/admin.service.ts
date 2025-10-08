import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/user.dto';
import { UserDetailDto } from '../models/user-detail.dto';
import { PagedAllOrders } from '../models/paged-all-orders';
import { PagedAllSchedules } from '../models/paged-all-schedules';
import { PagedUsersViewModel } from '../models/paged-users';
import { PagedUsersQuery } from '../models/paged-users-query';
import { ChangeUserRolesDto } from '../models/change-user-roles.dto';
import { UpdateUserRolesDto } from '../models/update-user-roles.dto';
import { PagedAllOrdersQuery } from '../models/paged-all-orders-query';
import { PagedAllSchedulesQuery } from '../models/paged-all-schedules-query';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: string): Observable<UserDetailDto> {
    return this.http.get<UserDetailDto>(`${this.baseUrl}/users/${id}`);
  }

  getPagedOrders(query: PagedAllOrdersQuery): Observable<PagedAllOrders> {
  return this.http.post<PagedAllOrders>(`${this.baseUrl}/orders`, query);
}

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }

  getPagedSchedules(query: PagedAllSchedulesQuery): Observable<PagedAllSchedules> {
    return this.http.post<PagedAllSchedules>(`${this.baseUrl}/schedules`, query);
  }

  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/schedules/${id}`);
  }

  getPagedUsers(query: PagedUsersQuery): Observable<PagedUsersViewModel> {
    query.length = Math.max(1, query.length);
    query.start  = Math.max(0, query.start);
    return this.http.post<PagedUsersViewModel>(`${this.baseUrl}/users/paged`, query);
  }

  changeUserRoles(userId: string, dto: ChangeUserRolesDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/roles`, dto);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  resetSecurityAttempts(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/reset-security-attempts`, {});
  }

  updateUserRoles(userId: string, dto: UpdateUserRolesDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}/roles`, dto);
  }
}