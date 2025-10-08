import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  OrderDetailDto
} from '../../shared/models/order';
import { 
  PagedOrdersQuery,
  PagedDataTableResponse,
  PagedOrdersViewModel
} from '../../shared/models/paged-orders';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// This service handles all HTTP operations related to orders
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Base URL for the schedules API
  private readonly baseUrl = environment.apiBaseUrl + '/orders';

  constructor(
    private http: HttpClient
  ) {}

  /** GET all orders */
  getAll(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.baseUrl);
  }

  /** GET one order by ID */
  getById(id: string): Observable<OrderDetailDto> {
    return this.http.get<OrderDetailDto>(`${this.baseUrl}/${id}`);
  }

  /** POST a new order */
  create(dto: CreateOrderDto): Observable<CreateOrderDto> {
    return this.http.post<CreateOrderDto>(this.baseUrl, dto);
  }

  /** PUT (update) an existing order */
  update(id: string, dto: UpdateOrderDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  /** DELETE an order by ID */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** GET all orders paged */
  getPaged(params: PagedOrdersQuery): Observable<PagedDataTableResponse<PagedOrdersViewModel>> {
    let httpParams = new HttpParams()
      .set('draw', params.draw.toString())
      .set('start', params.start.toString())
      .set('length', params.length.toString());

    // first sort instruction
    if (params.order?.length) {
      httpParams = httpParams
        .set('order[0].column', params.order[0].column.toString())
        .set('order[0].dir', params.order[0].dir);
    }

    // optional columns
    params.columns?.forEach((col, i) => {
      httpParams = httpParams
        .set(`columns[${i}].data`, col.data)
        .set(`columns[${i}].name`, col.name)
        .set(`columns[${i}].orderable`, col.orderable.toString())
    });

    return this.http.get<PagedDataTableResponse<PagedOrdersViewModel>>(
      `${this.baseUrl}/paged`, { params: httpParams }
    );
  }

  searchOrders(query: string) {
    return this.http.get<OrderDto[]>(`${this.baseUrl}/search`, { params: { q: query } });
  }

  exists(id: string) {
    return this.http.get<boolean>(`${this.baseUrl}/${id}/exists`).pipe(
      catchError(() => of(false))
    );
  }
}