import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ScheduleDto,
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleDetailDto
} from '../../shared/models/schedule';
import {
  PagedSchedulesQuery,
  PagedDataTableResponse,
  PagedSchedulesViewModel
}  from '../../shared/models/paged-schedules';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// This service handles all HTTP operations related to schedules
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  // Base URL for the schedules API
  private readonly baseUrl = environment.apiBaseUrl + '/schedules';

  constructor(private http: HttpClient) {}

  /** GET all schedules */
  getAll(): Observable<ScheduleDto[]> {
    return this.http.get<ScheduleDto[]>(this.baseUrl);
  }

  /** GET one schedule by ID */
  getById(id: string): Observable<ScheduleDetailDto> {
    return this.http.get<ScheduleDetailDto>(`${this.baseUrl}/${id}`);
  }

  /** POST a new schedule */
  create(dto: CreateScheduleDto): Observable<ScheduleDto> {
    return this.http.post<ScheduleDto>(this.baseUrl, dto);
  }

  /** PUT (update) an existing schedule */
  update(id: string, dto: UpdateScheduleDto): Observable<ScheduleDto> {
    return this.http.put<ScheduleDto>(`${this.baseUrl}/${id}`, dto);
  }

  /** DELETE an schedule by ID */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** GET all schedules paged */
  getPaged(params: PagedSchedulesQuery): Observable<PagedDataTableResponse<PagedSchedulesViewModel>> {
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

    return this.http.get<PagedDataTableResponse<PagedSchedulesViewModel>>(
      `${this.baseUrl}/paged`, { params: httpParams }
    );
  }
}