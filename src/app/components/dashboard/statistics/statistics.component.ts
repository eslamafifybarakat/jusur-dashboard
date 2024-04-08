import { AuthService } from './../../../services/authentication/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule],
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  userData: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }
}
