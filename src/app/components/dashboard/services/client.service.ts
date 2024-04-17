import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  addNote(data: any): Observable<any> {
    return this.http?.post(`${this.baseUrl}/${roots?.client.addNote}`, data);
  }
}
