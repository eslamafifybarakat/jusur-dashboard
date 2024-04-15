import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getRecordsList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, client_id?: number | string, clientHistory_id?: number | string): Observable<any> {
    let params = new HttpParams();
    if (page) {
      params = params?.append("page", page);
    }
    if (per_page) {
      params = params?.append("per_page", per_page);
    }
    if (search) {
      params = params?.append("search", search);
    }
    if (sort && Object.keys(sort)?.length > 0) {
      params = params?.append("sort", JSON?.stringify(sort));
    }
    if (conditions && conditions?.length > 0) {
      params = params?.append("conditions", JSON?.stringify(conditions));
    }
    if (client_id) {
      params = params?.append("client_id", client_id);
    }
    if (clientHistory_id) {
      params = params?.append("clientHistory_id", clientHistory_id);
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.records.getRecords}`, { params: params });
  }
  getSingleHistory(clientHistory_id: any): Observable<any> {
    let params = new HttpParams();
    params = params?.append("client_id", 1);
    if (clientHistory_id) {
      params = params?.append("clientHistory_id", clientHistory_id);
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.records.getRecords}`, { params: params });
    // return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.records.getSingleHistory}/${id}`);
  }
  addRecord(data: any, clientId?: string | number): Observable<any> {
    let params = new HttpParams();
    if (clientId) {
      params = params?.append("client_id", clientId);
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.records.addRecords}`, data, { params: params });
  }
  editRecord(data: any, id: any): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params?.append("id", id);
    }
    return this.http?.put(`${this.baseUrl}/${roots?.dashboard?.records.editRecords}`, data, { params: params });
  }
  deleteRecordById(id: number, data: any): Observable<any> {
    let params = new HttpParams();
    if (data?.name) {
      params = params.append("name", data?.name);
    }
    return this.http.delete<any>(`${this.baseUrl}${roots?.dashboard.records}/delete/` + id, { params: params });
  }
}
