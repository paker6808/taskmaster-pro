import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { routes } from './app.routes';
import { authInterceptor } from './features/authentication/interceptors/auth.interceptor';
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE_OPTIONS } from './shared/config/pagination-config';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: PAGE_SIZE_OPTIONS, useValue: DEFAULT_PAGE_SIZE_OPTIONS },
    { provide: LOCALE_ID, useValue: 'en-US' }
  ]
};