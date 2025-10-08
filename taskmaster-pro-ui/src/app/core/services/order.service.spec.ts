import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { environment } from '../../../environments/environment';
import { OrderDto } from '../../shared/models/order';
import { PagedOrdersQuery, OrderColumn } from '../../shared/models/paged-orders';
import { createOrderMock, orderDetailMock, orderMock, pagedOrdersMock, updateOrderMock } from '../../shared/mock-data';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl + '/orders';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all orders', () => {
    const mockOrders = [orderMock]

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should get order by id', () => {
    service.getById('1').subscribe(res => {
      expect(res).toEqual(orderDetailMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(orderDetailMock);
  });

  it('should create an order', () => {
    const mockResponse: OrderDto = {
      id: '1',
      ...createOrderMock,
      created: '2040-08-26T12:00:00Z',
      createdBy: 'user1',
      updated: undefined,
      updatedBy: undefined
    };

    service.create(createOrderMock).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createOrderMock);
    req.flush(mockResponse);
  });

  it('should update an order', () => {
    service.update('1', updateOrderMock).subscribe(res => expect(res).toBeNull());

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateOrderMock);
    req.flush(null);
  });

  it('should delete an order', () => {
    service.delete('1').subscribe(res => expect(res).toBeNull());

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get paged orders', () => {
    const columns: OrderColumn[] = [
      { data: 'customerName', name: 'Customer Name', orderable: true }
    ];

    const query: PagedOrdersQuery = {
      draw: 1,
      start: 0,
      length: 10, 
      order: [{ column: 0, dir: 'asc' }],
      columns
    };

    service.getPaged(query).subscribe(res => {
      expect(res).toEqual(pagedOrdersMock);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}/paged`);
    expect(req.request.method).toBe('GET');
    req.flush(pagedOrdersMock);
  });

  it('should search orders with query param q', () => {
    const mockResult = [orderMock];

    service.searchOrders('abc').subscribe(res => {
      expect(res).toEqual(mockResult);
    });

    // Find the GET request to /api/orders/search with q=abc
    const req = httpMock.expectOne(request =>
      request.method === 'GET' &&
      request.url.endsWith('/api/orders/search') &&
      request.params.get('q') === 'abc'
    );

    // Simulate backend response
    req.flush(mockResult);
  });

  it('should return true when /exists endpoint returns true', () => {
    service.exists('1').subscribe(res => expect(res).toBeTrue());

    const req = httpMock.expectOne(`${baseUrl}/1/exists`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should return false when /exists endpoint errors (mapped to false)', () => {
    service.exists('1').subscribe(res => expect(res).toBeFalse());

    const req = httpMock.expectOne(`${baseUrl}/1/exists`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
