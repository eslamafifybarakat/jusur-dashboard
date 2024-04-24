import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  // This approach manually adjusts the Date object to ensure the correct date is used regardless of the it's timezone.
  dateWithCorrectTimeZone(date: Date): Date {
    let birthDate: Date = date;
    let offset: number = birthDate.getTimezoneOffset() * 60000; // convert offset to milliseconds
    let adjustedDate: Date = new Date(birthDate.getTime() - offset);
    return adjustedDate;
  }
}
