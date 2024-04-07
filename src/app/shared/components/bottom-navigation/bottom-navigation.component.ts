import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'bottom-navigation',
  standalone: true,
  imports: [TranslateModule, RouterModule],
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent {

  startTrip(): void { }
  explore(): void { }
}
