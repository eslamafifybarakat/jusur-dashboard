import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from './public.service';


@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private messageService: MessageService,
    private publicService: PublicService,
    private router: Router
  ) { }

  openToast(type: any, title: any, details: any, key?: boolean): void {
    this.messageService.add({ severity: type, summary: title, detail: details, sticky: key ? key : false, icon: type == 'success' ? 'pi-check fs-5' : 'pi-info-circle fs-5' });
    // this.alertsService.openToast('info', 'Title', 'details', false)
    // this.alertsService.openToast('success', 'Title', 'details', true)
    // this.alertsService.openToast('warn', 'Title', 'details', false)
    // this.alertsService.openToast('error', 'Title', 'details', true)
  }
}
