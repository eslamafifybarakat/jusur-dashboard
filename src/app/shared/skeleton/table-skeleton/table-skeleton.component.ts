import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  imports: [TableModule, CommonModule, SkeletonModule],
  selector: 'table-skeleton',
  templateUrl: './table-skeleton.component.html',
  styleUrls: ['./table-skeleton.component.scss']
})
export class TableSkeletonComponent {

}
