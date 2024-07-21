import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { SettingsService } from '../../Services/Settings.service';
import { PrimeConfig } from '../../prime.config';
import { Accounts, MainAccCategories, SubAccCategories } from '../../Models/Accounts';
import { AccountsService } from '../../Services/Accounts.service';
import { UpdateData } from '../../Models/UpdateData';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild('dt2') dt2: Table | undefined;

  formData: any = {};
  AccountForm: FormGroup | undefined;
  OperationBtnText: string = 'Save'
  readonly : boolean = false;
  mainAccCategories : MainAccCategories[] = [];
  accounts : Accounts = new Accounts();
  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)
  updateData: UpdateData = new UpdateData()
  AccList : Accounts[] = [];
  subAccCategories : SubAccCategories[] = [];


  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
    public accountsService: AccountsService,
  ) {
    this.AccountForm = this.fb.group({
      id: new FormControl(0),
      code: new FormControl(''),
      mainAccCode: new FormControl('', Validators.required),
      subAccCode: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.CheckCodeIsEditable()
    this.selectMainAccCategories()
    this.SelectExistingAccountsData()
  }

  async CheckCodeIsEditable(){
    this.readonly = !await this.settingsService.isEnabled('ACM')
  }

  clearForm(){
    this.AccountForm?.reset();
    this.OperationBtnText = "Save";
  }

  selectMainAccCategories(){
    this.accountsService.SelectMainAccCategories('')
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
             this.mainAccCategories = data.data
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

  selectSubAccCategoriesForMainAccCategories(mainAccCode: string){
    this.accountsService.SelectSubAccCategories('',-999,mainAccCode)
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.subAccCategories = data.data
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

   //Insert and Update
   onSubmit() {
    this.accounts.id = this.AccountForm!.value.id;
    this.accounts.code = this.AccountForm!.value.code;
    this.accounts.subAccCode = this.AccountForm!.value.subAccCode;
    this.accounts.name = this.AccountForm!.value.name;
    this.accounts.userId = this.userid;
    if (this.OperationBtnText == "Save") {
      this.accountsService.InsertAccounts(this.accounts)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully inserted. Code is '+data.data[0].code)
              this.clearForm();
              this.SelectExistingAccountsData()
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

      this.updateData.newData =  this.accounts
      this.updateData.userID = this.userid

      console.log('updateData',this.updateData)
      this.accountsService.UpdateAccounts(this.updateData)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully updated')
              this.clearForm();
              this.SelectExistingAccountsData()
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

  selectToUpdate(accounts : Accounts){
    this.selectSubAccCategoriesForMainAccCategories(accounts.mainAccCode!)
    this.AccountForm!.patchValue({
      id: accounts.id,
      mainAccCode: accounts.mainAccCode,
      subAccCode: accounts.subAccCode,
      code: accounts.code,
      name: accounts.accName

    });
    this.updateData.oldData = this.AccountForm!.value;
    this.OperationBtnText = "Update";
  }

  delete(accounts : Accounts){
    this.accountsService.DeleteAccounts(accounts)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully Deleted')
              this.clearForm();
              this.SelectExistingAccountsData()
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

  onFilterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }

  SelectExistingAccountsData(){
    this.accountsService.SelectAccounts('','')
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
          console.log('this.AccList',data.data)
         this.AccList = data.data
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
