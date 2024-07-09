import { Inject, Injectable, Injector, Type } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  adminApiUrl: string;
  finApiUrl: string;
  key : string;
  iv : string ;

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
    this.adminApiUrl = settings.apiUrls.adminURL;
    this.finApiUrl = settings.apiUrls.finURL;
    this.key = settings.apiUrls.key;
    this.iv = settings.apiUrls.iv;
  }
}




