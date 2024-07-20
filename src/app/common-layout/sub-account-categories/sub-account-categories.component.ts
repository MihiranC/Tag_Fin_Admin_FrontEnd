import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { SettingsService } from '../../Services/Settings.service';
import { PrimeConfig } from '../../prime.config';
import { MainAccCategories, SubAccCategories } from '../../Models/Accounts';
import { AccountsService } from '../../Services/Accounts.service';
import { UpdateData } from '../../Models/UpdateData';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sub-account-categories',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './sub-account-categories.component.html',
  styleUrl: './sub-account-categories.component.scss'
})
export class SubAccountCategoriesComponent {

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild('dt2') dt2: Table | undefined;

  formData: any = {};
  SubAccountForm: FormGroup | undefined;
  OperationBtnText: string = 'Save'
  readonly : boolean = false;
  mainAccCategories : MainAccCategories[] = [];
  subAccCategory : SubAccCategories = new SubAccCategories();
  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)
  updateData: UpdateData = new UpdateData()
  subAccCategoryList : SubAccCategories[] = [];


  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
    public accountsService: AccountsService,
  ) {
    this.SubAccountForm = this.fb.group({
      id: new FormControl(0),
      code: new FormControl(''),
      mainAccCode: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.CheckCodeIsEditable()
    this.selectMainAccCategories()
    this.SelectExistingData()
  }

  async CheckCodeIsEditable(){
    this.readonly = !await this.settingsService.isEnabled('SAM')
  }

  clearForm(){
    this.SubAccountForm?.reset();
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

   //Insert and Update
   onSubmit() {
    this.subAccCategory.id = this.SubAccountForm!.value.id;
    this.subAccCategory.code = this.SubAccountForm!.value.code;
    this.subAccCategory.mainAccCode = this.SubAccountForm!.value.mainAccCode.code;
    this.subAccCategory.name = this.SubAccountForm!.value.name;
    if (this.OperationBtnText == "Save") {
      this.subAccCategory.userId = this.userid;
      this.accountsService.InsertSubAccCategory(this.subAccCategory)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully inserted. Code is '+data.data[0].code)
              this.clearForm();
              this.SelectExistingData()
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

      this.updateData.newData = this.SubAccountForm!.value
      this.updateData.userID = this.userid

      console.log('updateData',this.updateData)
      this.accountsService.UpdateSubAccCategory(this.updateData)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully updated')
              this.clearForm();
              this.SelectExistingData()
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

  selectToUpdate(subAccCategory : SubAccCategories){
    this.SubAccountForm!.patchValue({
      id: subAccCategory.id,
      mainAccCode: subAccCategory.mainAccCode,
      code: subAccCategory.code,
      name: subAccCategory.name

    });
    this.updateData.oldData = this.SubAccountForm!.value;
    this.OperationBtnText = "Update";
  }

  delete(subAccCategory : SubAccCategories){
    this.subAccCategory = subAccCategory;
    this.accountsService.DeleteSubAccCategory(this.subAccCategory)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully Deleted')
              this.clearForm();
              this.SelectExistingData()
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

  SelectExistingData(){
    this.accountsService.SelectSubAccCategories('',-999)
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.subAccCategoryList = data.data
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
