import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getEmployeesList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, clientHistory_id?: number | string): Observable<any> {
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
    if (clientHistory_id) {
      params = params?.append("clientHistory_id", clientHistory_id);
    }
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.employees.getEmployees}`, { params: params })
  }
  addEditEmployee(data: any, id?: number | string): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params?.append("id", id);
      return this.http?.put(`${this.baseUrl}/${roots?.dashboard?.employees.editEmployee}`, data, { params: params });
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.employees.addEmployee}`, data);
  }
  deleteEmployeeById(id: number): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params.append("id", id);
    }
    return this.http.delete<any>(`${this.baseUrl}${roots?.dashboard.employees.deleteEmployee}`, { params: params });
  }
}
