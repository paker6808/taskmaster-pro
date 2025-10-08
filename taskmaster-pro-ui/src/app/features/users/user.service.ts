import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDto } from '../../shared/models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Users`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  searchUsers(query: string): Observable<UserDto[]> {
    if (!query || query.trim().length < 3) return of([]); // avoid empty or too-short searches

    const q = encodeURIComponent(query.trim());
    return this.http.get<UserDto[]>(`${this.apiUrl}/search?query=${q}`)
      .pipe(
        catchError(() => of([]))
      );
  }

  exists(id: string): Observable<boolean> {
    if (!id) return of(false);
    return this.http.get<boolean>(`${this.apiUrl}/${id}/exists`).pipe(
      catchError(() => of(false))
    );
  }
}