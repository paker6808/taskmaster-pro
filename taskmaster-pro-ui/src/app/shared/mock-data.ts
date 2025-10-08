import { UserDto, PagedDataTableResponse as PagedUsersDataTableResponse } from './models/user.dto';
import { UserDetailDto } from '../features/admin/models/user-detail.dto';
import { OrderDto, CreateOrderDto, UpdateOrderDto, OrderDetailDto, OrderStatus } from '../shared/models/order';
import { PagedDataTableResponse as PagedOrdersDataTableResponse, PagedOrdersViewModel } from '../shared/models/paged-orders';
import { ScheduleDto, CreateScheduleDto, UpdateScheduleDto, ScheduleDetailDto } from '../shared/models/schedule';
import { PagedDataTableResponse as PagedSchedulesDataTableResponse, PagedSchedulesViewModel } from '../shared/models/paged-schedules';
import { DashboardStatsDto } from '../features/dashboard/models/dashboard-stats.dto';


// ====================
// User Mocks
// ====================
export const userMock: UserDto = {
  id: '00000000-0000-0000-0000-000000000001',
  userName: 'nikola',
  email: 'nikola@examle.com',
  emailConfirmed: true,
  fullName: 'Nikola Example',
  roles: ['Admin'],
  displayName: 'Nikola'
};

const userMock2: UserDto = {
  id: '00000000-0000-0000-0000-000000000002',
  userName: 'alice',
  email: 'alice@example.com',
  emailConfirmed: true,
  fullName: 'Alice Example',
  roles: ['User'],
  displayName: 'Alice'
};

const userMock3: UserDto = {
  id: '00000000-0000-0000-0000-000000000003',
  userName: 'bob',
  email: 'bob@example.com',
  emailConfirmed: false,
  fullName: 'Bob Example',
  roles: ['User'],
  displayName: 'Bob'
};

export const pagedUsersMock: PagedUsersDataTableResponse<UserDto> = {
  data: [userMock, userMock2, userMock3],
  draw: 1,
  recordsTotal: 3
};

export const userDetailMock: UserDetailDto = {
  id: 'user1',
  userName: 'testuser',
  email: 'test@example.com',
  emailConfirmed: true,
  fullName: 'Test User',
  roles: ['User']
};

const userDetailMock2: UserDetailDto = {
  id: 'user2',
  userName: 'aliceuser',
  email: 'aliceuser@example.com',
  emailConfirmed: true,
  fullName: 'Alice User',
  roles: ['User']
};

const userDetailMock3: UserDetailDto = {
  id: 'user3',
  userName: 'bobuser',
  email: 'bobuser@example.com',
  emailConfirmed: false,
  fullName: 'Bob User',
  roles: ['User']
};

export const pagedUserDetailsMock: PagedUsersDataTableResponse<UserDetailDto> = {
  data: [userDetailMock, userDetailMock2, userDetailMock3],
  draw: 1,
  recordsTotal: 3
};


// ====================
// Order Mocks
// ====================
export const orderMock: OrderDto = {
  id: 'bf1e889c-e59a-f011-a540-4c23384be95e',
  customerName: 'AAAAAAA',
  // Using a future-proof date (2040) to avoid current-year logic breaking charts/tests
  orderDate: '2040-01-01T00:00:00Z',
  status: OrderStatus.New,
  totalAmount: 100,
  created: '2040-01-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000001',
  updated: undefined,
  updatedBy: undefined
};

const orderMock2: OrderDto = {
  id: 'bf1e889c-e59a-f011-a540-4c23384be96e',
  customerName: 'BBBBBBB',
  orderDate: '2040-02-01T00:00:00Z',
  status: OrderStatus.Processing,
  totalAmount: 200,
  created: '2040-02-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000002',
  updated: undefined,
  updatedBy: undefined
};

const orderMock3: OrderDto = {
  id: 'bf1e889c-e59a-f011-a540-4c23384be97e',
  customerName: 'CCCCCCC',
  orderDate: '2040-03-01T00:00:00Z',
  status: OrderStatus.Completed,
  totalAmount: 300,
  created: '2040-03-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000003',
  updated: undefined,
  updatedBy: undefined
};

export const createOrderMock: CreateOrderDto = {
  customerName: 'New Customer',
  orderDate: '2040-01-01T00:00:00Z',
  status: OrderStatus.New,
  totalAmount: 150
};

export const updateOrderMock: UpdateOrderDto = {
  id: '1',
  customerName: 'Updated Customer',
  orderDate: '2040-01-01T00:00:00Z',
  status: OrderStatus.Processing,
  totalAmount: 200
};

export const orderDetailMock: OrderDetailDto = {
  ...orderMock,
  createdBy: userMock as unknown as any,
  updatedBy: userMock
};

export const pagedOrdersMock: PagedOrdersDataTableResponse<PagedOrdersViewModel> = {
  data: [orderMock, orderMock2, orderMock3],
  draw: 1,
  recordsTotal: 3
};


// ====================
// Schedule Mocks
// ====================
export const scheduleMock: ScheduleDto = {
  id: '97d1301e-0f41-4265-bc30-f438882857e2',
  orderId: 'b7c69338-0b2c-4449-36bb-0791a315fb38',
  title: 'aaaaaaa',
  scheduledStart: '2040-01-01T00:00:00Z',
  scheduledEnd: '2040-01-15T00:00:00Z',
  description: 'aaaaa',
   assignedTo: { 
    id: '', 
    displayName: '', 
    email: ''
  },
  created: '2040-01-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000001',
  updated: '',
  updatedBy: '',
};

const scheduleMock2: ScheduleDto = {
  id: '97d1301e-0f41-4265-bc30-f438882857e3',
  orderId: 'b7c69338-0b2c-4449-36bb-0791a315fb39',
  title: 'bbbbbbb',
  scheduledStart: '2040-02-01T00:00:00Z',
  scheduledEnd: '2040-02-15T00:00:00Z',
  description: 'bbbbb',
  assignedTo: undefined,
  created: '2040-02-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000002',
  updated: undefined,
  updatedBy: undefined
};

const scheduleMock3: ScheduleDto = {
  id: '97d1301e-0f41-4265-bc30-f438882857e4',
  orderId: 'b7c69338-0b2c-4449-36bb-0791a315fb40',
  title: 'ccccccc',
  scheduledStart: '2040-03-01T00:00:00Z',
  scheduledEnd: '2040-03-15T00:00:00Z',
  description: 'ccccc',
  assignedTo: undefined,
  created: '2040-03-01T00:00:00Z',
  createdBy: '00000000-0000-0000-0000-000000000003',
  updated: undefined,
  updatedBy: undefined
};

export const createScheduleMock: CreateScheduleDto = {
  orderId: 'b7c69338-0b2c-4449-36bb-0791a315fb38',
  title: 'New Schedule',
  scheduledStart: '2040-01-01T00:00:00Z',
  scheduledEnd: '2040-01-15T00:00:00Z',
  description: 'New description',
  assignedToId: 'user1'
};

export const updateScheduleMock: UpdateScheduleDto = {
  id: '97d1301e-0f41-4265-bc30-f438882857e2',
  orderId: 'b7c69338-0b2c-4449-36bb-0791a315fb38',
  title: 'Updated Schedule',
  scheduledStart: '2040-01-01T00:00:00Z',
  scheduledEnd: '2040-01-15T00:00:00Z',
  description: 'Updated description',
  assignedToId: 'user1'
};

export const scheduleDetailMock: ScheduleDetailDto = {
  ...scheduleMock,
  assignedTo: userMock,
  createdBy: userMock as unknown as any,
  updatedBy: userMock as unknown as any
};

export const pagedSchedulesMock: PagedSchedulesDataTableResponse<PagedSchedulesViewModel> = {
  data: [scheduleMock, scheduleMock2, scheduleMock3],
  draw: 1,
  recordsTotal: 3
};


// ====================
// Dsshboard Mocks
// ====================
export const dashboardStatsMock: DashboardStatsDto = {
  totalOrders: 10,
  totalSchedules: 5,
  totalUsers: 3,
  monthlyOrders: [
    { month: 1, count: 2 },
    { month: 2, count: 1 }
  ],
  monthlySchedules: [
    { month: 1, count: 1 },
    { month: 2, count: 3 }
  ]
};

export const dashboardStatsEmptyMock: DashboardStatsDto = {
  totalOrders: 0,
  totalSchedules: 0,
  totalUsers: 0,
  monthlyOrders: [],
  monthlySchedules: []
};