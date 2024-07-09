import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import {HttpClient,HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  getSavingsAccountsForUser(parameter: string): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletAccountDetails/SelectWalletAccountDetailsSavings',parameter.trim())
  }

  getFDAccountsForUser(parameter: string): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletAccountDetails/SelectWalletAccountDetailsFD',parameter.trim())
  }

  getPawningAccountsForUser(parameter: string): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletAccountDetails/SelectWalletAccountDetailsPawning',parameter.trim())
  }

  getLeasingAccountsForUser(parameter: string): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletAccountDetails/SelectWalletAccountDetailsLease',parameter.trim())
  }
}
