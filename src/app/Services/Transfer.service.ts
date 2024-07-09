import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import {HttpClient,HttpRequest, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';
import { InsertTransfer } from '../Models/Transfers';


@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(
    private GlobalService : GlobalService,
    private Http: HttpClient,
    private HttpService: HttpService
  ) { }

  getBanks(): Observable<Response> {
    return this.HttpService.getDataWithCookie('api/Wallet/WalletTransfer/SelectBank','')
  }

  getBankBranches(parameter: string): Observable<Response> {
    return  this.HttpService.getDataWithCookie('api/Wallet/WalletTransfer/SelectBankBranch',parameter.trim())
  }

  deletePayee(parameter: string): Observable<Response> {
    return  this.HttpService.getDataWithCookie('api/Wallet/WalletTransfer/SelectBankBranch',parameter.trim())
  }

  InsertTransfer(InsertTransfer: InsertTransfer): Observable<Response> {
    return this.HttpService.postDataWithCookie(InsertTransfer,'api/Wallet/WalletTransfer/InsertFundTransfer')
  }

}
