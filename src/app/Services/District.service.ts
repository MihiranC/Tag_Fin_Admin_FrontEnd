import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Districts } from "../Models/DistrictModel";
import { UpdateData } from "../Models/UpdateData";
import { HttpService } from "./Http.service";
import { Response } from '../Models/Response';
import { GlobalService } from './Global.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  districts: Districts[] | undefined;
  UpdateData: UpdateData[] | undefined;

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }


  InsertDistricts(districts: Districts): Observable<Response> {
    return this.HttpService.postData(districts, 'api/TGAdmin/Ref_Districts/Insert',this.GlobalService.adminApiUrl)
  }

  UpdateDistricts(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData, 'api/TGAdmin/Ref_Districts/Update',this.GlobalService.adminApiUrl)
  }

  DeleteDistricts(districts: Districts): Observable<any> {
    return this.HttpService.postData(districts, 'api/TGAdmin/Ref_Districts/Delete',this.GlobalService.adminApiUrl)
  }

  ReturnDistricts(distictId: number): Observable<any> {
    return this.HttpService.getData('api/TGAdmin/Ref_Districts/Select', `districtID=${distictId}`,this.GlobalService.adminApiUrl)
  }

}
