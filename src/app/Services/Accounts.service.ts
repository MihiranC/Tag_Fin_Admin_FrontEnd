import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import { HttpClient,HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './Http.service';
import { Response } from '../Models/Response';
import { Accounts, EntryHeader, SubAccCategories } from '../Models/Accounts';
import { UpdateData } from '../Models/UpdateData';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  SelectMainAccCategories(code: string): Observable<any> {
    return this.HttpService.getData('api/TagFin/Account/SelectMainAccCategories', `code=${code}`,this.GlobalService.finApiUrl)
  }

  InsertSubAccCategory(data: SubAccCategories): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Account/InsertSubAccCategories',this.GlobalService.finApiUrl)
  }

  UpdateSubAccCategory(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData,'api/TagFin/Account/UpdateSubAccCategories',this.GlobalService.finApiUrl)
  }

  DeleteSubAccCategory(data: SubAccCategories): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Account/DeleteSubAccCategories',this.GlobalService.finApiUrl)
  }

  SelectSubAccCategories(code: string, id: number, mainAccCode: string): Observable<any> {
    return this.HttpService.getData('api/TagFin/Account/SelectSubAccCategories', `code=${code}&id=${id}&mainAccCode=${mainAccCode}`,this.GlobalService.finApiUrl)
  }

  SelectAccounts(mainAccCode: string, subAccCode: string): Observable<any> {
    return this.HttpService.getData('api/TagFin/Account/SelectAccounts', `mainAccCode=${mainAccCode}&subAccCode=${subAccCode}`,this.GlobalService.finApiUrl)
  }

  InsertAccounts(data: Accounts): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Account/InsertAccounts',this.GlobalService.finApiUrl)
  }

  UpdateAccounts(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData,'api/TagFin/Account/UpdateAccounts',this.GlobalService.finApiUrl)
  }

  DeleteAccounts(data: Accounts): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Account/DeleteAccounts',this.GlobalService.finApiUrl)
  }

  InsertEntry(data: EntryHeader): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Account/InsertEntry',this.GlobalService.finApiUrl)
  }


}
