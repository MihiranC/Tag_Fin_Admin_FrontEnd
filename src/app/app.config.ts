import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { PrimeConfig } from './prime.config'
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppSettingsService } from './app-settings.service';
import { preloadAppSettings } from './preload-app-settings.factory';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    BrowserModule,
    PrimeConfig,
    {
      provide: APP_INITIALIZER,
      deps: [AppSettingsService],
      multi: true,
      useFactory: preloadAppSettings,
    },
    AppSettingsService,
    { provide: "APP_SETTINGS_SERVICE", useValue: AppSettingsService },
    MessageService, 
  ]
};
