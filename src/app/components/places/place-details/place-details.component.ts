// Modules
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


// Services
import { LocalizationLanguageService } from './../../../services/generic/localization-language.service';
import { MetaDetails, MetadataService } from '../../../services/generic/metadata.service';
import { PlaceApiResponse, PlaceData, PlacesListing } from '../../../interfaces/places';
import { PublicService } from '../../../services/generic/public.service';
import { environment } from './../../../../environments/environment';
import { PlacesService } from '../../../services/places.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [
    // Modules
    RouterModule,
    CommonModule
  ],
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent {
  private subscriptions: Subscription[] = [];
  private imageBaseUrl: string = '';
  private metaDetails: MetaDetails | undefined;

  /* --- Start Place Details Variables --- */
  private placeSlug: any = null;
  placeDetails: PlaceData | undefined;
  isLoadingPlaceDetails: boolean = false;
  /* --- End Place Details Variables --- */

  /* --- Start Related Places Variables --- */
  isLoadingRelatedPlaces: boolean = false;
  relatedPlaces: PlacesListing[] = [];
  relatedPlacesCount: number = 0;
  /* --- Start Related Places Variables --- */

  /* --- Start Place Action Variables --- */
  // favorite/share/go to map etc
  private fullPageUrl: string = '';
  /* --- End Place Action Variables --- */

  /* --- Start Tabs Variables --- */
  InformationView: boolean = false;
  featuresView: boolean = false;
  mapView: boolean = false;
  chatGptView: boolean = false;
  /* --- End Tabs Variables --- */

  constructor(
    private localizationLanguageService: LocalizationLanguageService,
    private metadataService: MetadataService,
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private placesService: PlacesService
  ) {
    localizationLanguageService.updatePathAccordingLang();
  }

  ngOnInit(): void {
    this.initPageData();
  }
  private initPageData(): void {
    this.placeSlug = 'dar-al-madinah-museum';
    this.imageBaseUrl = environment.imageBaseUrl;
    this.activatedRoute.params.subscribe((params) => {
      this.placeSlug = params['slug'];
      if (this.placeSlug) {
        this.getPLaceDataBySlug(this.placeSlug);
        // this.fullPageUrl = environment.publicUrl + this.localizationLanguageService.getFullURL();
      }
    });
  }
  /* --- Start Place Details Functions --- */
  getPLaceDataBySlug(slug: any, preventLoading?: boolean): void {
    if (!preventLoading) {
      this.isLoadingPlaceDetails = true;
    }
    let placeDataSubscription: Subscription = this.placesService.getPLaceItemData(slug).pipe(
      tap((res: PlaceApiResponse) => {
        if (res?.code === 200) {
          this.placeDetails = res.data;
          this.handlePlaceDetails();
        } else {
          this.handleError(res?.message);
        }
      }),
      catchError(err => {
        this.handleError(err);
        return []; // Return an empty array or appropriate fallback value
      }),
      finalize(() => {
        this.isLoadingPlaceDetails = false;
        this.updateMeta(); // Remove After Function Working Successfully
      })
    ).subscribe();

    this.subscriptions.push(placeDataSubscription);
  }
  private handlePlaceDetails(): void {
    this.updateMeta();
    this.updateRate();
    this.updateAddress();
    this.updateAddressName();
    this.showInformationTab();
  }
  private updateMeta(): void {
    if (this.placeDetails) {
      this.metaDetails = {
        title: this.placeDetails.title,
        description: this.placeDetails.description,
        image: this.placeDetails.image
      }
    };
    this.metadataService.updateMetaTagsForSEO(this.metaDetails, this.fullPageUrl);
  }
  private updateRate(): void {
    if (this.placeDetails?.rate != null) {
      this.placeDetails.rate = Math.ceil(this.placeDetails.rate);
    }
  }
  private updateAddress(): void {
    if (this.placeDetails?.lat != null && this.placeDetails?.long != null && this.placeDetails.address_type === 'map') {
      this.placeDetails.address = this.publicService.createGoogleMapsLink(this.placeDetails.lat, this.placeDetails.long);
    }
  }
  private updateAddressName(): void {
    if (!this.placeDetails) return;
    const { region, city } = this.placeDetails;
    const parts = [region?.name, city?.name].filter(Boolean);
    if (parts.length) {
      this.placeDetails.address_name = parts.join(' - ');
    }
  }
  /* --- End Place Details Functions --- */

  /* --- Start Tabs Functions --- */
  showInformationTab(): void {
    this.InformationView = true;
    this.featuresView = false;
    this.mapView = false;
    this.chatGptView = false;
  }
  showFeaturesTab(): void {
    this.featuresView = true;
    this.InformationView = false;
    this.mapView = false;
    this.chatGptView = false;
  }
  showMapTab(): void {
    this.mapView = true;
    this.InformationView = false;
    this.featuresView = false;
    this.chatGptView = false;
  }
  showChatGptTab(): void {
    this.chatGptView = true;
    this.mapView = false;
    this.InformationView = false;
    this.featuresView = false;
  }
  /* --- End Tabs Functions --- */

  /* --- Start Reviews Functions --- */
  /* --- End Reviews Functions --- */

  //Handle api requests error messages
  private handleError(err: any): any {
    this.setErrorMessage(err || 'An error has occurred');
  }
  private setErrorMessage(message: string): void {
    // Implementation for displaying the error message, e.g., using a toast
    // Example: this.alertsService?.openToast('error', message);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
