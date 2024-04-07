import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [SkeletonModule, CommonModule],
  selector: 'skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  @Input() type: string = '';
}
