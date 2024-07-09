
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from "../Models/CityModel";
import { UpdateData } from "../Models/UpdateData";
import { GlobalService } from "./Global.service";
import { HttpService } from "./Http.service";
import { Response } from '../Models/Response';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  city: City[] | undefined;
  UpdateData: UpdateData[] | undefined;

  // constructor(
  //   private HTTPRequests: CommonHTTPRequestsService,
  //   private GlobalParameters: GlobalParametersService) {
  // }

  constructor(
    private HttpService: HttpService
  ) { }



  ReturnCities(cityID: number): Observable<Response> {
    return this.HttpService.getData('api/TGAdmin/Ref_Cities/Select', `cityID=${cityID}`)
  }

}
