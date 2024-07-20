import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpService } from './Http.service';
import { Response } from '../Models/Response';
import { GlobalService } from './Global.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private HttpService: HttpService,
        private GlobalService: GlobalService
    ) { }


    getSetting(code: string): Observable<Response> {
        return this.HttpService.getData('api/TGAdmin/Settings/Select', `code=${code}`, this.GlobalService.adminApiUrl)
    }

    async isEnabled(code: string): Promise<boolean> {
        try {
          const data = await this.getSetting(code).toPromise();
          if (data!.code === "1000") {
            return data!.data![0].isEnable;
          } else {
            return false;
          }
        } catch (error) {
          console.log('err', error);
          return false;
        }
      }
}
