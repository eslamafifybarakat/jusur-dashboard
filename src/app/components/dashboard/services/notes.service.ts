import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { roots } from '../../../shared/configs/roots';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  baseUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getNotesList(page?: number, per_page?: number, search?: string, sort?: any, conditions?: any, client_id?: number | string, clientHistory_id?: number | string): Observable<any> {
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
    return this.http?.get(`${this.baseUrl}/${roots?.dashboard?.notes.getNotes}`, { params: params });
  }
}
