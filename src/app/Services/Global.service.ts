import { Inject, Injectable, Injector, Type } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  primaryLendingApiUrl: string;
  primaryCommonApiUrl: string;
  primaryCommonApiUrlUpload: string;
  primaryCentralLoginApiUrl: string;
  primaryMessageQueueApiUrl: string;
  key : string;
  iv : string ;

  primaryURL  : string;
  reportURL : string;
  HNB_PABX : string;

  constructor(
    private injector: Injector,
    //@Inject("APP_SETTINGS_SERVICE") private appSettingsService
    
    // Specify the type for appSettingsService
    @Inject("APP_SETTINGS_SERVICE") private appSettingsService : any

  ) {
    const settings = this.injector.get(
      this.appSettingsService as Type<any>
    ).settings;

    // do not hard code an api url in here.
    this.primaryCentralLoginApiUrl = settings.apiUrls.primaryCentralLoginApiUrl;
    this.primaryCommonApiUrl = settings.apiUrls.primaryCommonApiUrl;
    this.primaryCommonApiUrlUpload = settings.apiUrls.primaryCommonApiUrlUpload;
    this.primaryMessageQueueApiUrl = settings.apiUrls.primaryMessageQueueApiUrl;
    this.primaryLendingApiUrl = settings.apiUrls.primaryLendingApiUrl;
    this.primaryURL  = settings.apiUrls.primaryURL;
    this.reportURL = settings.apiUrls.reportURL;
    this.HNB_PABX = settings.apiUrls.HNB_PABX;
    this.key = settings.apiUrls.key;
    this.iv = settings.apiUrls.iv;
    
  }
}




