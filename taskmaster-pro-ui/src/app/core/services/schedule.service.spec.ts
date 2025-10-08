import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ScheduleService } from './schedule.service';
import { environment } from '../../../environments/environment';
import { ScheduleDto} from '../../shared/models/schedule';
import { PagedSchedulesQuery, ScheduleColumn } from '../../shared/models/paged-schedules';
import { UserDto } from '../../shared/models/user.dto';
import { scheduleDetailMock, createScheduleMock, scheduleMock, updateScheduleMock, pagedSchedulesMock } from '../../shared/mock-data';

const mockUser: UserDto = {
  id: 'user1',
  displayName: 'User One',
  email: 'user1@example.com'
};

describe('ScheduleService', () => {
  let service: ScheduleService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl + '/schedules';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScheduleService]
    });

    service = TestBed.inject(ScheduleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all schedules', () => {
    const mockSchedules = [scheduleMock]

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockSchedules);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSchedules);
  });

  it('should get schedule by id', () => {
    service.getById('1').subscribe(res => {
      expect(res).toEqual(scheduleDetailMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(scheduleDetailMock);
  });

  it('should create a schedule', () => {
    const mockResponse: ScheduleDto = {
      id: '1',
      ...createScheduleMock,
      assignedTo: mockUser,
      created: '2040-08-26T12:00:00Z',
      createdBy: 'user1',
      updated: undefined,
      updatedBy: undefined
    };

    service.create(createScheduleMock).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createScheduleMock);
    req.flush(mockResponse);
  });

  it('should update a schedule', () => {
    const mockResponse: ScheduleDto = {
      ...updateScheduleMock,
      assignedTo: mockUser,
      created: '2040-08-26T12:00:00Z',
      createdBy: 'user1',
      updated: '2040-08-27T01:00:00Z',
      updatedBy: 'user1'
    };

    service.update('1', updateScheduleMock).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateScheduleMock);
    req.flush(mockResponse);
  });

  it('should delete a schedule', () => {
    service.delete('1').subscribe(res => expect(res).toBeNull());

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get paged schedules', () => {
    const columns: ScheduleColumn[] = [
      { data: 'title', name: 'Title',orderable: true }
    ];

    const query: PagedSchedulesQuery = {
      draw: 1,
      start: 0,
      length: 10,
      order: [{ column: 0, dir: 'asc' }],
      columns
    };

    service.getPaged(query).subscribe(res => {
      expect(res).toEqual(pagedSchedulesMock);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/paged`);
    expect(req.request.method).toBe('GET');
    req.flush(pagedSchedulesMock);
  });
});
