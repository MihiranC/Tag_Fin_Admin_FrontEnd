import { Component, NgZone, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PrimeConfig } from '../../prime.config';

import { UserService } from '../../Services/User.service';
import { Response } from '../../Models/Response';
import { Router } from '@angular/router';
import { MessagesComponent } from '../../messages/messages.component';
import { Login } from '../../Models/LoginModel';
import { Users } from '../../Models/UserModel';
import { Subscription } from 'rxjs';
import { UpdateData } from '../../Models/UpdateData';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;

  Users: Users[] = []

  formData: any = {};

  ResponseObj: Response = new Response();

  UserObject: Login = new Login()

  UserForm: FormGroup | undefined;

  UserList: Login[] | undefined;

  OperationBtnText: string = 'Save'
  userObject: Users = new Users()
  usersList: Users[] = [];
  userID: number = 1;
  readOnly: boolean | undefined = false;
  updateData: UpdateData = new UpdateData()

  router: any;

  constructor(
    private fb: FormBuilder,
    public Router: Router,
    private zone: NgZone,
    public userService: UserService,
  ) {

    this.UserForm = this.fb.group({
      userID: new FormControl(),
      username: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNo: new FormControl('', Validators.required),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(),
      addressLine3: new FormControl(),
      addressLine4: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.email])
    });

  }

  ngOnInit(): void {
    this.loadExistingUsers();
    this.readOnly = false;
  }


  //Insert and Update the officer Details.
  onSubmit() {
    this.userObject.username = this.UserForm!.value.username;
    this.userObject.firstName = this.UserForm!.value.firstName;
    this.userObject.lastName = this.UserForm!.value.lastName;
    this.userObject.addressLine1 = this.UserForm!.value.addressLine1;
    this.userObject.addressLine2 = this.UserForm!.value.addressLine2;
    this.userObject.addressLine3 = this.UserForm!.value.addressLine3;
    this.userObject.addressLine4 = this.UserForm!.value.addressLine4;
    this.userObject.mobileNo = this.UserForm!.value.mobileNo;
    this.userObject.email = this.UserForm!.value.email;
    this.userObject.roleCode = 'U';
    if (this.OperationBtnText == "Save") {
      this.userObject.userID = -999;
      this.userService.InsertUsers(this.userObject)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully inserted')
              this.clearForm();
              this.loadExistingUsers();
            }
            else {
              this.messagesComponent!.showError(data.message);
            }
          },
          error: (error: any) => {
            this.messagesComponent?.showError(error);
          },
        });
    }
    else {

      this.updateData.newData = this.UserForm!.value
      this.updateData.userID = this.userID

      console.log('updateData',this.updateData)
      this.userService.UpdateUsers(this.updateData)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully updated')
              this.clearForm();
              this.loadExistingUsers();
            }
            else {
              this.messagesComponent!.showError(data.description);
            }
          },
          error: (error: any) => {
            this.messagesComponent?.showError(error);
          },
        });
    }

  }

  selectDataToForm(row: any) {
    this.readOnly = true;
    this.UserForm!.patchValue({
      userID: row.userID,
      username: row.username,
      firstName: row.firstName,
      lastName: row.lastName,
      mobileNo: row.mobileNo,
      email: row.email,
      addressLine1: row.addressLine1,
      addressLine2: row.addressLine2,
      addressLine3: row.addressLine3,
      addressLine4: row.addressLine4,

    });
    this.updateData.oldData = this.UserForm!.value;
    this.OperationBtnText = "Update";
    //this.UserNameField=true
  }

  clearForm() {
    this.UserForm!.reset();
    this.OperationBtnText = "Save";
    this.readOnly = false;
  }

  loadExistingUsers() {
    this.userService.ReturnUsers(-999, 'U')
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.Users = data.data
          } else {
            this.messagesComponent?.showError(data.message);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        },
      });
  }

  onDelete(row: any) {
    //.userObject.userID =  row.userID;
    this.userObject.username = row.username;
    this.userObject.firstName = row.firstName;
    this.userObject.lastName = row.lastName;
    this.userObject.addressLine1 = row.addressLine1;
    this.userObject.addressLine2 = row.addressLine2;
    this.userObject.addressLine3 = row.addressLine3;
    this.userObject.addressLine4 = row.addressLine4;
    this.userObject.mobileNo = row.mobileNo;
    this.userObject.email = row.email;


    this.userObject.userID = row.userID;

    this.userService.DeleteUsers(this.userObject)
      .subscribe(data => {
        if (data.code == "1000") {
          //this.alertService.showSuccess('Successfully deleted')
          this.clearForm();
          //this.loadExistingUser();
        }
        else {
          //this.alertService.showError(data.description)
        }
      }
      );
  }

  confirmDialog(row: any): void {
    const message = `Are you sure you want to delete this?`;

    //const dialogData = new ConfirmDialogModel("Delete confirmation", message);

    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: dialogData,
    //   panelClass: 'custom-error-dialog-container'
    // });

    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   if (dialogResult) {
    //     this.onDelete(row);
    //   }
    // });
  }


}

