import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT_MS = 12000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.apiUrl}${path}`, { withCredentials: true }).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, { withCredentials: true }).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, { withCredentials: true }).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.apiUrl}${path}`, { withCredentials: true }).pipe(timeout(REQUEST_TIMEOUT_MS));
  }
}
