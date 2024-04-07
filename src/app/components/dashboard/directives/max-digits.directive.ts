import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[MaxDigits]'
})
export class MaxDigitsDirective {
  @Input() maxNumber: number = 9;
  constructor() { }
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > this.maxNumber) {
      input.value = value.slice(0, this.maxNumber);
      input.dispatchEvent(new Event('input'));// Trigger input event to notify Angular of the change
      event.preventDefault();
    }
  }
}
