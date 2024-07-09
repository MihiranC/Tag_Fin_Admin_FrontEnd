import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import {HttpClient,HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';
import { Payee } from '../Models/Payee';


@Injectable({
  providedIn: 'root'
})
export class PayeeService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  insertPayee(payee: Payee): Observable<Response> {
    return this.HttpService.postDataWithCookie(payee,'api/Wallet/WalletPayeeManagement/InsertPayee')
  }

  selectPayee(parameter: string): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletTransfer/SelectRegisteredPayeeList',parameter)
  }
}
