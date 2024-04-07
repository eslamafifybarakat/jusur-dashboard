import { PublicService } from './../../../services/generic/public.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'overlay-loading',
  templateUrl: './overlay-loading.component.html',
  styleUrls: ['./overlay-loading.component.scss']
})
export class OverlayLoadingComponent implements OnInit {
  show_overlay: boolean = false;
  constructor(private publicService: PublicService) { }

  ngOnInit(): void {
    this.publicService.showGlobalLoader.subscribe((res: any) => {
      if (res == true) {
        this.show_overlay = true;
      } else {
        this.show_overlay = false;
      }
    });
  }
}
