import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../Models/UserModel';
import { UpdateData } from '../Models/UpdateData';
import { HttpService } from "./Http.service";
import { GlobalService } from './Global.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: Users[] | undefined;
  UpdateData: UpdateData[] | undefined;

  constructor(
    private HttpService: HttpService,
    private GlobalService: GlobalService
  ) { }

  InsertUsers(users: Users): Observable<any> {
    return this.HttpService.postData(users,'api/TGAdmin/Users/Insert',this.GlobalService.adminApiUrl)
  } 

  UpdateUsers(UpdateData: UpdateData): Observable<any> {
    return this.HttpService.postData(UpdateData,'api/TGAdmin/Users/Update',this.GlobalService.adminApiUrl)
  }

  DeleteUsers(users: Users): Observable<any> {
    return this.HttpService.postData(users,'api/TGAdmin/Users/Delete',this.GlobalService.adminApiUrl)
  }

  ReturnUsers(userId: number, roleCode: string): Observable<any> {
    return this.HttpService.getData('api/TGAdmin/Users/Select', `userId=${userId}&roleCode=${roleCode}`,this.GlobalService.adminApiUrl)
  }


}
