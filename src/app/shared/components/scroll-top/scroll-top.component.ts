import { Component, HostListener } from '@angular/core';

@Component({
  standalone: true,
  selector: 'scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent {
  scrollProgress: number = 0;
  @HostListener("window:scroll", ["$event"])
  handleKeyDown() {
    let element: any = document.querySelector("#progress") as HTMLElement;
    if (window.pageYOffset > 50) {
      element ? element.classList.remove("d-none") : '';
      // this.publicService?.scrollTop?.next(true);
    } else {
      element ? element.classList.add("d-none") : '';
      // this.publicService?.scrollTop?.next(false);
    }
  }

  constructor(
    // private publicService: PublicService
  ) { }

  ngOnInit(): void {
  }

  scrollTop(): void {
    window?.scrollTo(0, 0);
  }
}
