import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatsDto } from '../models/dashboard-stats.dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getStats(year?: number): Observable<DashboardStatsDto> {
    let params = new HttpParams();
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    return this.http.get<DashboardStatsDto>(`${this.apiUrl}/Dashboard/stats`, { params });
  }
}