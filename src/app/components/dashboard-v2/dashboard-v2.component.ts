// Modules
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { DashboardNavbarComponent } from './../../shared/components/dashboard-navbar/dashboard-navbar.component';
import { AsideMenuV2Component } from './../../shared/components/aside-menu-v2/aside-menu-v2.component';
import { FooterComponent } from './../../shared/components/footer/footer.component';
@Component({
  standalone: true,
  imports: [
    // Modules
    RouterModule,
    CommonModule,

    // Components
    DashboardNavbarComponent,
    AsideMenuV2Component,
    FooterComponent,
  ],
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component {
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;
  toggleSideMenu: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  //  Method to handle the side menu collapse on screens
  onToggleSideNav(data: any): void {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }

  // Method to determine the CSS class based on screen width
  getDashClass(): string {
    let styleClass = '';
    if (this.isSideNavCollapsed && this.screenWidth > 768 && !this.toggleSideMenu) {
      styleClass = 'dash-trimmed';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 0 && !this.toggleSideMenu) {
      styleClass = 'dash-md-screen';
    }
    return styleClass;
  }
}



