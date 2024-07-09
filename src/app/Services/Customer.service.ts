import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateData } from '../Models/UpdateData';
import { HttpService } from "./Http.service";
import { Customer } from '../Models/Customer';
import { GlobalService } from './Global.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }

  Insert(data: Customer): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Customer/Insert',this.GlobalService.finApiUrl)
  }

  Update(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData,'api/TagFin/Customer/Update',this.GlobalService.finApiUrl)
  }

  Delete(data: Customer): Observable<any> {
    return this.HttpService.postData(data,'api/TagFin/Customer/Delete',this.GlobalService.finApiUrl)
  }

  Select(code: string, firstName: string, lastName: string, mobileNo: string, nicNo: string, email: string, records: number): Observable<any> {
    return this.HttpService.getData('api/TagFin/Customer/Select', `code=${code}&firstName=${firstName}&lastName=${lastName}&mobileNo=${mobileNo}&nicNo=${nicNo}&email=${email}&records=${records}`,this.GlobalService.finApiUrl)
  }

  //add sample
}
