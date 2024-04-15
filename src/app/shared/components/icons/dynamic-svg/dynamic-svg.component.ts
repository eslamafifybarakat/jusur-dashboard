import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-svg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-svg.component.html',
  styleUrls: ['./dynamic-svg.component.scss']
})
export class DynamicSvgComponent {
  @Input() fillColor: string = '#CECECE';  // Default color
  @Input() name: string;  // Default color

  constructor() { }

  ngOnInit(): void {
  }
}
