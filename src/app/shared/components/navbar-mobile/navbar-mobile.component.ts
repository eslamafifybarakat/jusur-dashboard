//Modules
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';

//Services
import { NavItem, navItems } from './../../../interfaces/navbar';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { keys } from '../../configs/localstorage-key';

//Components
import { LanguageSelectorComponent } from './../language-selector/language-selector.component';


@Component({
  selector: 'navbar-mobile',
  standalone: true,
  imports: [
    //Modules
    SidebarModule,
    RouterModule,
    TranslateModule,
    CommonModule,
    NgOptimizedImage,
    //Components
    LanguageSelectorComponent
  ],
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss']
})
export class NavbarMobileComponent {
  displayMenu: boolean = false;
  isUserLoggedIn: boolean = false;
  currentLanguage: string | null = '';

  navItems: NavItem[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = localStorage.getItem(keys.language);
    }
    this.loadData();
  }
  loadData(): void {
    this.navItems = navItems;
  }

  openSidebar(): void {
    this.displayMenu = true;
  }

  closeSidebar(): void {
    this.displayMenu = false;
  }

  logOut(): void {
    // Implement logout logic
    this.closeSidebar();
  }

  login(): void {
    // Implement login logic
    this.closeSidebar();
  }
}
