import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private HttpService: HttpService
  ) { }
  

  GetMemues(userid: number): Observable<Response> {
    return this.HttpService.getData('api/TGAdmin/Pages/Select', `userid=${userid}`)
  }
}
