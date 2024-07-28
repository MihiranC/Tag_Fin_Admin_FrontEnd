import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { SettingsService } from '../../Services/Settings.service';
import { PrimeConfig } from '../../prime.config';
import { Accounts, MainAccCategories, SubAccCategories } from '../../Models/Accounts';
import { AccountsService } from '../../Services/Accounts.service';
import { UpdateData } from '../../Models/UpdateData';
import { Table } from 'primeng/table';
import { Inquiry } from '../../Models/Inquiry';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './inquiry.component.html',
  styleUrl: './inquiry.component.scss',
  providers: [DatePipe]
})
export class InquiryComponent {

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild('dt2') dt2: Table | undefined;

  formData: any = {};
  InquiryForm: FormGroup | undefined;
  OperationBtnText: string = 'Search'
  readonly : boolean = false;
  mainAccCategories : MainAccCategories[] = [];
  inquiry : Inquiry = new Inquiry();
  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)
  updateData: UpdateData = new UpdateData()
  InqList : Inquiry[] = [];
  InqListNew : Inquiry[] = [];
  subAccCategories : SubAccCategories[] = [];

  value1: number = 0.00;
  value2: number = 0.00;
  date1: Date | undefined;
  date2: Date | undefined;


  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
    public accountsService: AccountsService,
    private datePipe: DatePipe
  ) {
    this.InquiryForm = this.fb.group({
      mainAccCode: new FormControl('', Validators.required),
      subAccCode: new FormControl('', Validators.required),
      customerCode: new FormControl(''),      
      accountNo: new FormControl(''),
      entryNo: new FormControl(''),
      fromAmount: new FormControl(''),
      toAmount: new FormControl(''),
      fromDate: new FormControl(),
      toDate: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.selectMainAccCategories()
  }

  formatDate(date: Date): string | null {
    if (isNaN(date.getTime())) {
      return this.datePipe.transform('2020-01-01', 'yyyy-MM-dd');
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  clearForm(){
    this.InquiryForm?.reset();
    this.OperationBtnText = "Search";
    this.value1= 0.00;
    this.value2= 0.00;
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

   //Search
   onSubmit() {
    this.inquiry.mainAccCode = this.InquiryForm!.value.mainAccCode;
    this.inquiry.subAccCode = this.InquiryForm!.value.subAccCode;
    this.inquiry.customerCode = this.InquiryForm!.value.customerCode;
    this.inquiry.accountNo = this.InquiryForm!.value.accountNo;
    this.inquiry.entryNo = this.InquiryForm!.value.entryNo;
    this.inquiry.fromAmount = this.InquiryForm!.value.fromAmount.toString();
    this.inquiry.toAmount = this.InquiryForm!.value.toAmount.toString();
    this.inquiry.fromDate = this.formatDate(new Date(this.InquiryForm!.value.fromDate)) == "1970-01-01" ? "2020-01-01" : this.formatDate(new Date(this.InquiryForm!.value.fromDate));
    this.inquiry.toDate = this.formatDate(new Date(this.InquiryForm!.value.toDate)) == "1970-01-01" ? "2020-01-01" : this.formatDate(new Date(this.InquiryForm!.value.toDate));    
    this.inquiry.userId = this.userid;

      this.accountsService.SearchAccountsInquiry(this.inquiry)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              if(data.data.length == 0){
                this.messagesComponent!.showSuccess('No data found')
              }else{
                this.messagesComponent!.showSuccess('Successfully Search for given details')
                //this.clearForm();
                this.InqList = data.data
              } 
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

}
