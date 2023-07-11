import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string= `${environment.apiUrl}/api`;
  private http = inject(HttpClient);

  constructor() { }

  getNewToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/v1/getAccessToken`);
  }
}
