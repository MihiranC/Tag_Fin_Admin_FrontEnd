import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';
import { GlobalService } from './Global.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }
  

  GetMemues(userid: number): Observable<Response> {
    return this.HttpService.getData('api/TGAdmin/Pages/Select', `userid=${userid}`,this.GlobalService.adminApiUrl)
  }
}
