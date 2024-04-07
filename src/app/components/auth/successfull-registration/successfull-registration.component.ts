import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [RouterModule, TranslateModule],
  selector: 'successfull-registration',
  templateUrl: './successfull-registration.component.html',
  styleUrls: ['./successfull-registration.component.scss']
})
export class SuccessfullRegistrationComponent {
  name: string = '';
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.name = params['name'];
    });
  }
}
