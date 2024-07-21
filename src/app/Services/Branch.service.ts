import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import { HttpClient,HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './Http.service';
import { Response } from '../Models/Response';


@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  Select(code: string): Observable<any> {
    return this.HttpService.getData('api/TagFin/Branch/Select', `code=${code}`,this.GlobalService.finApiUrl)
  }
}
