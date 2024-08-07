import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import { HttpClient,HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './Http.service';
import { Response } from '../Models/Response';
import { Accounts, EntryHeader, SubAccCategories } from '../Models/Accounts';
import { UpdateData } from '../Models/UpdateData';
import { ScheduleInputs } from '../Models/Schedule';
import { CalDetails } from '../Models/Application';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  GenerateSchedule(data: ScheduleInputs): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Application/GenerateSchedule',this.GlobalService.finApiUrl)
  }

  InsertCaldetails(data: CalDetails): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Application/InsertCaldetails',this.GlobalService.finApiUrl)
  }

  UpdateCaldetails(data: CalDetails): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Application/UpdateCaldetails',this.GlobalService.finApiUrl)
  }

  DeleteCaldetails(data: CalDetails): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Application/DeleteCaldetails',this.GlobalService.finApiUrl)
  }
}