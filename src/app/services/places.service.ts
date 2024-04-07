import { environment } from '../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { roots } from '../shared/configs/roots';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  apiUrl: string = environment?.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getPlaces(page?: number, perPage?: number, search?: string, regionId?: number|string, cityId?: number|string, categoryId?: number|string, subCategoryId?: any, priceId?: number|string, top_visited?: boolean, top_featured?: boolean): Observable<any> {
    let params = new HttpParams();
    if (page != null) {
      params = params.append('page', page);
    }
    if (perPage) {
      params = params.append('per_page', perPage);
    }
    if (search) {
      params = params.append('search', search);
    }
    if (regionId) {
      params = params.append('region_id', regionId);
    }
    if (cityId) {
      params = params.append('city_id', cityId);
    }
    if (categoryId != null) {
      params = params.append('category_id', categoryId);
    }
    if (subCategoryId) {
      params = params.append('sub_category_id', subCategoryId);
    }
    if (priceId) {
      params = params.append('price_id', priceId);
    }
    if (top_visited) {
      params = params.append('top_visited ', top_visited);
    }
    if (top_featured) {
      params = params.append('top_featured', top_featured);
    }
    return this.http.get(`${this.apiUrl}/${roots.supplier.getCountries}`, { params: params });
  }

  
  getPLaceItemData(queryKey: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${roots?.supplier.getCountries}/${queryKey}`);
  }
}
