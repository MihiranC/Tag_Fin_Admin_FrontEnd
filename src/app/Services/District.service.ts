import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Districts } from "../Models/DistrictModel";
import { UpdateData } from "../Models/UpdateData";
import { HttpService } from "./Http.service";
import { Response } from '../Models/Response';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  districts: Districts[] | undefined;
  UpdateData: UpdateData[] | undefined;

  constructor(
    private HttpService: HttpService
  ) { }


  InsertDistricts(districts: Districts): Observable<Response> {
    return this.HttpService.postData(districts, 'api/TGAdmin/Ref_Districts/Insert')
  }

  UpdateDistricts(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData, 'api/TGAdmin/Ref_Districts/Update')
  }

  DeleteDistricts(districts: Districts): Observable<any> {
    return this.HttpService.postData(districts, 'api/TGAdmin/Ref_Districts/Delete')
  }

  ReturnDistricts(distictId: number): Observable<any> {
    return this.HttpService.getData('api/TGAdmin/Ref_Districts/Select', `districtID=${distictId}`)
  }

}
