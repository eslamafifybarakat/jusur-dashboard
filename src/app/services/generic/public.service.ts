import { environment } from './../../../environments/environment.development'
import { AbstractControl, FormControl, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs/internal/Observable'
import { roots } from './../../shared/configs/roots'
import { Inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private readonly baseUrl = environment?.apiUrl

  showGlobalLoader = new Subject<boolean>()
  showSearchLoader = new Subject<boolean>()
  resetTable = new BehaviorSubject<boolean>(false)
  changePageSub = new BehaviorSubject<{}>({})

  // ====Start Employees and Vehicles actions=========
  isLoadingEmployees = new BehaviorSubject<boolean>(false)
  isLoadingSearchEmployees = new BehaviorSubject<boolean>(false)
  employeesLength = new BehaviorSubject<{}>(null)
  addEmployeeItem = new BehaviorSubject<boolean>(false)
  resetEmployeesData = new BehaviorSubject<boolean>(false)
  filterEmployeesData = new BehaviorSubject<boolean>(false)
  searchEmployeesData = new BehaviorSubject<{}>(null)
  toggleFilterEmployeeDataType = new BehaviorSubject<{}>(null)

  isLoadingVehicles = new BehaviorSubject<boolean>(false)
  isLoadingSearchVehicles = new BehaviorSubject<boolean>(false)
  VehicleLength = new BehaviorSubject<{}>(null)
  addVehicleItem = new BehaviorSubject<boolean>(false)
  resetVehiclesData = new BehaviorSubject<boolean>(false)
  filterVehiclesData = new BehaviorSubject<boolean>(false)
  searchVehiclesData = new BehaviorSubject<{}>(null)
  toggleFilterVehicleDataType = new BehaviorSubject<{}>(null)
  // ====End Employees and Vehicles actions=========

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private http: HttpClient,
  ) { }

  translateTextFromJson(text: string): any {
    return this.translate.instant(text)
  }

  clearValidationErrors(control: AbstractControl): void {
    control?.markAsPending();
  }
  validateAllFormFields(form: any): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field)
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

  IsNationalIdentityAvailable(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + roots.dashboard.availability.IsNationalIdentityAvailable, data);
  }
  IsEmailAvailable(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + roots.dashboard.availability.IsEmailAvailable, data);
  }
  IsPhoneAvailable(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + roots.dashboard.availability.IsPhoneAvailable, data);
  }
  IsRecordNumberAvailable(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/' + roots.dashboard.availability.IsRecordNumberAvailable, data);
  }

  getCities(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${roots?.auth.isEmailAvailable}`);
  }

  createGoogleMapsLink(latitude: number, longitude: number): string {
    const baseUrl = "https://www.google.com/maps/search/?api=1&query=";
    return `${baseUrl}${latitude},${longitude}`;
  }
}
