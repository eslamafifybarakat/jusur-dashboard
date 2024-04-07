import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LanguageSelectorComponent],
  selector: 'quick-registration',
  templateUrl: './quick-registration.component.html',
  styleUrls: ['./quick-registration.component.scss']
})
export class QuickRegistrationComponent {

}
