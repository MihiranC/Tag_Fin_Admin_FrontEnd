import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError,map} from 'rxjs/operators';
import { Router} from '@angular/router';

import { EncryptionService } from './encryption.service';
import { GlobalService } from './Global.service';
import { Response } from '../Models/Response';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = this.GlobalService.primaryURL;
  private cookie: string | null = null;

  constructor(
    private http: HttpClient,
    private EncryptionService: EncryptionService,
    private GlobalService: GlobalService,
    private router: Router
  ) { }

  // ------------- Without Cookie --------------------------------
  postData(data: any, endpoint: string): Observable<Response> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'text'
    });
    //data = this.EncryptionService.encrypt(JSON.stringify(data));
    const options = { headers: headers };
    let url = `${this.apiUrl}/${endpoint}`;

    return this.http.post(url, data, options)
      .pipe(
        map((encryptedResponse: any) => {
          const decryptedResponse = this.EncryptionService.decryptResponse(encryptedResponse as Response);
          return decryptedResponse;
        }),
        catchError((error: any) => {
          if(error.status==404){
            throw("404");
          }
          else if (error.error.data) {
            throw (error.error.data.message)
          } else {
            throw ("something went wrong.");
          }
        })
      );
  }

  getData(endpoint: string, parameter: string): Observable<Response> {
    //parameter = this.EncryptionService.encrypt(parameter);
    let url = `${this.apiUrl}/${endpoint}`;
    if (parameter.length > 0) {
      url += `?${parameter}`;
    }
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map((encryptedResponse: any) => {
          //const decryptedResponse = this.EncryptionService.decryptResponse(JSON.parse(encryptedResponse) as Response);
          return JSON.parse(encryptedResponse);
        }),
        // map((encryptedResponse: any) => {
        //   const decryptedResponse = this.EncryptionService.decryptResponse(JSON.parse(encryptedResponse) as Response);
        //   return decryptedResponse;
        // }),
        catchError((error: any) => {
          if(error.status==404){
            throw("404");
          }
          else if (error.error.data) {
            throw (error.error.data.message)
          } else {
            throw ("something went wrong.");
          }
        })
      );
  }

  //----------------------END-------------------------------------

  //----------------Get Login cookie -----------------------------

  getLogin(endpoint: string, parameter: string): Observable<Response> {
    parameter = this.EncryptionService.encrypt(parameter);
    let url = `${this.apiUrl}/${endpoint}`;
    if (parameter.length > 0) {
      url += `?${parameter}`;
    }
    return this.http.get(url,{ observe: 'response' })
      .pipe(
        map((encryptedResponse: any) => {
          const decryptedResponse = this.EncryptionService.decryptResponse(encryptedResponse.body as Response);
          const Cookie: string | null = encryptedResponse.headers.get('x-custom-set-cookie')!;
          sessionStorage.setItem("cookie", Cookie!);
          return decryptedResponse;
        }),
        catchError((error: any) => {
          var errorObj = JSON.parse(error.error);
          if (errorObj.data) {
            throw errorObj.data.message;
          } else {
            throw "something went wrong";
          }
        })

      );
  }

  //----------------------END-------------------------------------


  // ------------- With Cookie --------------------------------

  postDataWithCookie(data: any, endpoint: string): Observable<Response> {
    this.cookie = sessionStorage.getItem("cookie");
    const headers = new HttpHeaders({
      'x-Cookie': this.cookie == null ? '' : this.cookie,
      'Content-Type': 'application/json',
      'responseType': 'text'
    });
    data = this.EncryptionService.encrypt(JSON.stringify(data));
    const options = { headers: headers };
    let url = `${this.apiUrl}/${endpoint}`;

    return this.http.post(url, data, options)
      .pipe(
        map((encryptedResponse: any) => {
          const decryptedResponse = this.EncryptionService.decryptResponse(encryptedResponse as Response);
          return decryptedResponse;
        }),
        catchError((error: any) => {
          if(error.status==404){
            throw("404");
          }
          else if (error.error.data) {
            throw (error.error.data.message)
          } else {
            throw ("something went wrong.");
          }
        })
      );
  }


  getDataWithCookie(endpoint: string, parameter: string): Observable<Response> {
    this.cookie = sessionStorage.getItem("cookie");
    const headers = this.cookie ? new HttpHeaders({ 'x-Cookie': this.cookie }) : undefined;
    parameter = this.EncryptionService.encrypt(parameter);

    let url = `${this.apiUrl}/${endpoint}`;
    if (parameter.length > 0) {
      url += `?${parameter}`;
    }
    return this.http.get(url, { headers, responseType: 'text' })
      .pipe(
        map((encryptedResponse: any) => {
          const decryptedResponse = this.EncryptionService.decryptResponse(JSON.parse(encryptedResponse) as Response);
          return decryptedResponse;
        }),
        catchError((error: any) => {
          console.log('error',error)
          if(error.status==404){
            throw("404");
          }
          else if (error.error.data) {
            throw (error.error.data.message)
          } else {
            throw ("something went wrong.");
          }
        })
      );
  }

  //----------------------END-------------------------------------

}
