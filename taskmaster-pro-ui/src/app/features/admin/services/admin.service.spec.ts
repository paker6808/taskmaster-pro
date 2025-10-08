import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../../../shared/models/user.dto';
import { UserDetailDto } from '../models/user-detail.dto';
import { PagedAllOrders } from '../models/paged-all-orders';
import { PagedAllOrdersQuery } from '../models/paged-all-orders-query';
import { PagedAllSchedules } from '../models/paged-all-schedules';
import { PagedAllSchedulesQuery } from '../models/paged-all-schedules-query';
import { PagedUsersViewModel } from '../models/paged-users';
import { PagedUsersQuery } from '../models/paged-users-query';
import { ChangeUserRolesDto } from '../models/change-user-roles.dto';
import { UpdateUserRolesDto } from '../models/update-user-roles.dto';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl + '/admin';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    const mockUsers: UserDto[] = [{ id: '1', username: 'user1' } as any];

    service.getAllUsers().subscribe(res => {
      expect(res).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user by id', () => {
    const mockUser: UserDetailDto = { id: '1', username: 'user1' } as any;

    service.getUserById('1').subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get paged orders', () => {
    const query: PagedAllOrdersQuery = {
      draw: 1,
      start: 0,
      length: 10,
      order: [],
      columns: []
    };

    const mockResponse: PagedAllOrders = {
      data: [],
      draw: 1,
      recordsTotal: 0
    } as any;

    service.getPagedOrders(query).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(query);
    req.flush(mockResponse);
  });

  it('should delete an order', () => {
    service.deleteOrder('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/orders/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get paged schedules', () => {
    const query: PagedAllSchedulesQuery = {
      draw: 1,
      start: 0,
      length: 10,
      order: [],
      columns: []
    };

    const mockResponse: PagedAllSchedules = {
      data: [],
      draw: 1,
      recordsTotal: 0
    } as any;

    service.getPagedSchedules(query).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/schedules`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(query);
    req.flush(mockResponse);
  });

  it('should delete a schedule', () => {
    service.deleteSchedule('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/schedules/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get paged users', () => {
    const query: PagedUsersQuery = { draw: 1, start: 0, length: 10 } as any;
    const mockResponse: PagedUsersViewModel = { data: [], draw: 1, recordsTotal: 0 } as any;

    service.getPagedUsers(query).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/users/paged`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should change user roles', () => {
    const dto: ChangeUserRolesDto = { roles: ['Admin'] } as any;

    service.changeUserRoles('1', dto).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/1/roles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(null);
  });

  it('should delete a user', () => {
    service.deleteUser('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should reset security attempts', () => {
    service.resetSecurityAttempts('1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/1/reset-security-attempts`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should update user roles', () => {
    const dto: UpdateUserRolesDto = { roles: ['User'] } as any;

    service.updateUserRoles('1', dto).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/users/1/roles`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(null);
  });
});
