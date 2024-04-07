import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { keys } from '../../shared/configs/localstorage-key';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang: any;
  localeEvent = new Subject<string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translate: TranslateService) { }

  changeLang(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLang = localStorage.getItem(keys.language);
      if (this.currentLang !== lang) {
        localStorage.setItem(keys.language, lang);
        window.location.reload();
        window?.scrollTo(0, 0);
      }
      setTimeout(() => {
        this.translate.use(lang);
        this.localeEvent.next(lang);

        let direction =
          localStorage.getItem(keys.language) === "ar"
            ? "rtl"
            : "ltr";
        document.documentElement.dir = direction;
        document.documentElement.lang = this.currentLang;

        let getMain = document.getElementsByTagName("html")[0];
        getMain.setAttribute("lang", this.currentLang);
        getMain.setAttribute("class", this.currentLang);
      }, 1000);
    }
  }

  getSelectedLanguage(): any {
    if (isPlatformBrowser(this.platformId)) {
      return (
        localStorage.getItem(keys.language) || this.translate.getDefaultLang()
      );
    }
  }
}
