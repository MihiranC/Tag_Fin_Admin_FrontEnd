import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {HttpService} from './Http.service';
import { Response } from '../Models/Response';
import { SignUp } from '../Models/SignUpModel';
import { Login } from '../Models/LoginModel';
import { ChangePassword } from '../Models/ChangePasswordModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private HttpService: HttpService
  ) { }
  

  GetUserName(encrpUserName: string): Observable<Response> {
    return this.HttpService.getData('api/TGAdmin/Login/GetUserName', `encrpUserName=${encrpUserName}`)
  }

  //UserProcessFirstSignup
  UserProcessFirstSignup(SignUpObject: SignUp ): Observable<Response>{
    return this.HttpService.postData(SignUpObject, 'api/TGAdmin/Login/UserProcessFirstSignup')
  }

  verifiedUserCredentials(loginObject: Login ): Observable<Response> {
    return this.HttpService.postData(loginObject, 'api/TGAdmin/Login/UserCheckLogin')
  }


  //change Password Request
  ChangePasswordForUserRequest(parameter: string): Observable<Response>{
    return this.HttpService.getData('api/TGAdmin/Login/UserChangePasswordRequest',parameter.trim())
  }

  //change Password
  UserChangePassword(ChangePasswordObject: ChangePassword ): Observable<Response>{
    return this.HttpService.postData(ChangePasswordObject, 'api/TGAdmin/Login/UserChangePassword')
  }
  

}
