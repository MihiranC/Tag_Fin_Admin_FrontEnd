
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
export class ReferenceService {

  city: City[] | undefined;
  UpdateData: UpdateData[] | undefined;

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }

  SelectProducts(code: string): Observable<Response> {
    return this.HttpService.getData('api/TagFin/Reference/SelectProduct', `code=${code}`,this.GlobalService.finApiUrl)
  }

  SelectProductWiseChargers(chargeCode: string, productCode: string): Observable<Response> {
    return this.HttpService.getData('api/TagFin/Reference/SelectProductWiseChargers', `chargeCode=${chargeCode}&productCode${productCode}`,this.GlobalService.finApiUrl)
  }

  SelectCalMethdFrequency(): Observable<Response> {
    return this.HttpService.getData('api/TagFin/Reference/SelectCalMethdFrequency', '',this.GlobalService.finApiUrl)
  }

  SelectProductWiseCalMethods(productCode: string): Observable<Response> {
    return this.HttpService.getData('api/TagFin/Reference/SelectProductWiseCalMethods', `productCode=${productCode}`,this.GlobalService.finApiUrl)
  }

}
