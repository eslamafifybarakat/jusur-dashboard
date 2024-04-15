import { AuthService } from './../../services/authentication/auth.service';
import { SkeletonComponent } from './../../shared/skeleton/skeleton/skeleton.component';
import { DynamicSvgComponent } from 'src/app/shared/components/icons/dynamic-svg/dynamic-svg.component';
import { DynamicTableComponent } from './../../shared/components/dynamic-table/dynamic-table.component';
import { DynamicTableLocalActionsComponent } from './../../shared/components/dynamic-table-local-actions/dynamic-table-local-actions.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  standalone: true,
  imports: [
    // Modules
    TranslateModule,
    CommonModule,
    PaginatorModule,

    // Components
    DynamicTableLocalActionsComponent,
    DynamicTableComponent,
    DynamicSvgComponent,
    SkeletonComponent
  ],
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {
  userData: any;
  dataStyleType: string = 'list';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }

  // Toggle data style table or card
  changeDateStyle(type: string): void {
    this.dataStyleType = type;
  }
}
