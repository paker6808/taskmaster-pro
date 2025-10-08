import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { pagedUsersMock, userMock } from '../../shared/mock-data';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/Users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

   it('getById should call the correct URL and return user', (done) => {
    service.getById('1').subscribe(res => {
      expect(res).toEqual(userMock);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(userMock);
  });

  it('should return empty array if query is empty', (done) => {
    service.searchUsers('').subscribe(res => {
      expect(res).toEqual([]);
      done();
    });
  });

  it('should return empty array if query is 1 char', (done) => {
    service.searchUsers('a').subscribe(res => {
      expect(res).toEqual([]);
      done();
    });
  });

  it('should return empty array if query is 2 chars', (done) => {
    service.searchUsers('ab').subscribe(res => {
      expect(res).toEqual([]);
      done();
    });
  });

  it('should call the correct API and return users', (done) => {
    service.searchUsers('John').subscribe(res => {
      expect(res).toEqual(pagedUsersMock.data);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/search?query=John`);
    expect(req.request.method).toBe('GET');
    req.flush(pagedUsersMock.data);
  });

  it('should return empty array on API error', (done) => {
    service.searchUsers('John').subscribe(res => {
      expect(res).toEqual([]);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/search?query=John`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should return true if user exists', (done) => {
    service.exists('123').subscribe(res => {
      expect(res).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/123/exists`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should return false if user does not exist', (done) => {
    service.exists('123').subscribe(res => {
      expect(res).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/123/exists`);
    req.flush(false);
  });

  it('should return false on API error', (done) => {
    service.exists('123').subscribe(res => {
      expect(res).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/123/exists`);
    req.error(new ErrorEvent('Network error'));
  });
});
