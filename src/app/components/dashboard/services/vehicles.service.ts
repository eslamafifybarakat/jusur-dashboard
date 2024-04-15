import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from './../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getVehiclesList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, clientHistory_id?: string | number): Observable<any> {
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.vehicles.getVehicles}`, { params: params })
  }
  addEditVehicle(data: any, id?: number | string): Observable<any> {
    let params = new HttpParams();
    if (id) {
      params = params?.append("id", id);
      return this.http?.put(`${this.baseUrl}/${roots?.dashboard?.vehicles.editVehicle}`, data, { params: params });
    }
    return this.http?.post(`${this.baseUrl}/${roots?.dashboard?.vehicles.addVehicle}`, data);
  }
  deleteVehicleById(id: number, data: any): Observable<any> {
    let params = new HttpParams();
    if (data?.name) {
      params = params.append("name", data?.name);
    }
    return this.http.delete<any>(`${this.baseUrl}${roots?.dashboard.vehicles}/delete/` + id, { params: params });
  }
}
