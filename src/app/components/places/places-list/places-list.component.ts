import { Component } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MetadataService } from '../../../services/generic/metadata.service';

@Component({
  selector: 'app-places-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.scss']
})
export class PlacesListComponent {
  constructor(
    private metadataService: MetadataService
  ) { }
  ngOnInit(): void {
    this.updateMetaTagsForSEO();
  }
  private updateMetaTagsForSEO(): void {
    this.metadataService.updateTitle(`الاماكن`);
    this.metadataService.updateMetaTagsName([
      { name: 'title', content: `الاماكن` },
      { name: 'description', content: 'الوصف' },
    ]);
    this.metadataService.updateMetaTagsProperty([
      // {
      //   property: 'og:url',
      //   content: `${environment.publicUrl}/places/details/${this.placeDetails.slug}`,
      // },
      { property: 'og:title', content: `الاماكن` },
      { property: 'og:description', content: 'الوصف' },
      // {
      //   property: 'og:image',
      //   content: this.imageBaseUrl + '/' + this.placeDetails.image,
      // },
    ]);
  }
}
