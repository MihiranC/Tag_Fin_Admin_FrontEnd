import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';
import { SignUp } from '../Models/SignUpModel';
import { Login } from '../Models/LoginModel';
import { ChangePassword } from '../Models/ChangePasswordModel';
import { GlobalService } from './Global.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }
  

  GetUserName(encrpUserName: string): Observable<Response> {
    return this.HttpService.getData('api/TGAdmin/Login/GetUserName', `encrpUserName=${encrpUserName}`,this.GlobalService.adminApiUrl)
  }

  //UserProcessFirstSignup
  UserProcessFirstSignup(SignUpObject: SignUp ): Observable<Response>{
    return this.HttpService.postData(SignUpObject, 'api/TGAdmin/Login/UserProcessFirstSignup',this.GlobalService.adminApiUrl)
  }

  verifiedUserCredentials(loginObject: Login ): Observable<Response> {
    return this.HttpService.postData(loginObject, 'api/TGAdmin/Login/UserCheckLogin',this.GlobalService.adminApiUrl)
  }


  //change Password Request
  ChangePasswordForUserRequest(parameter: string): Observable<Response>{
    return this.HttpService.getData('api/TGAdmin/Login/UserChangePasswordRequest',parameter.trim(),this.GlobalService.adminApiUrl)
  }

  //change Password
  UserChangePassword(ChangePasswordObject: ChangePassword ): Observable<Response>{
    return this.HttpService.postData(ChangePasswordObject, 'api/TGAdmin/Login/UserChangePassword',this.GlobalService.adminApiUrl)
  }
  

}
