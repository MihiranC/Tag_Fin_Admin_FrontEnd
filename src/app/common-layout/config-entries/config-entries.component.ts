import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { Table } from 'primeng/table';
import { EntryDetails, EntryHeader, MainAccCategories, PaymentMethods, SubAccCategories } from '../../Models/Accounts';
import { SettingsService } from '../../Services/Settings.service';
import { AccountsService } from '../../Services/Accounts.service';
import { PrimeConfig } from '../../prime.config';
import { AccountSearchComponent } from '../CommonControllers/account-search/account-search.component';
import { BranchService } from '../../Services/Branch.service';
import { Branch } from '../../Models/Branch';
import { CustomerSearchComponent } from '../CommonControllers/customer-search/customer-search.component';
import { Customer } from '../../Models/Customer';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { formatNumber } from '../../common-functions/number';

@Component({
  selector: 'app-config-entries',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent, AccountSearchComponent, CustomerSearchComponent],
  templateUrl: './config-entries.component.html',
  styleUrl: './config-entries.component.scss'
})
export class ConfigEntriesComponent {

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild(AccountSearchComponent) accountSearchComponent: AccountSearchComponent | undefined;
  @ViewChild(CustomerSearchComponent) customerSearchComponent: CustomerSearchComponent | undefined;
  @ViewChild('dt2') dt2: Table | undefined;

  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)

  formData: any = {};
  EntryForm: FormGroup | undefined;
  OperationBtnText: string = 'Add'
  readonly: boolean = false;
  mainAccCategories: MainAccCategories[] = [];
  subAccCategoryList: SubAccCategories[] = [];
  branches: Branch[] = [];
  paymentMethods: PaymentMethods[] = [];

  entryDetailsList: EntryDetails[] = []

  entryDetailsObj: EntryDetails = new EntryDetails();
  entryHeaderObj: EntryHeader = new EntryHeader();

  drCrOptions: any[] = [{ label: 'DR', value: 'DR' }, { label: 'CR', value: 'CR' }];

  isSelected: boolean = false; // Default value is DR
  debitTotalFormated: string = "0.00"
  creditTotalFormated: string = "0.00"
  debitTotal: number = 0
  creditTotal: number = 0

  selectedCurrentIndex : number = 0;

  enType : string = 'J'

  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
    public accountsService: AccountsService,
    public branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.EntryForm = this.fb.group({
      //id: new FormControl(0),
      //entryNo: new FormControl(''),
      branchCode: new FormControl(''),
      accCode: new FormControl(''),
      amount: new FormControl(''),
      drCr: [true],//DR
      narration: new FormControl('', Validators.required),
      entryDate: new FormControl('', Validators.required),
      customerCode : new FormControl(''),
      payMethod: new FormControl(''),
    });
  }

  

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.enType = params['EnType'];
      this.clearAll();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.route.queryParams.subscribe(params => {
          this.enType = params['EnType'];
          this.clearAll();
        });
      }
    });
    this.loadBranch();
    this.loadPaymentMethods();
  }

  loadBranch() {
    this.branchService.Select('')
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.branches = data.data
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

  
  loadPaymentMethods() {
    this.accountsService.SelectPaymentMethods('')
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.paymentMethods = data.data
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

  onFilterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }

  SaveEntryDetails() {
    if (this.EntryForm?.value.branchCode == "" || this.EntryForm?.value.accCode == "" || formatNumber(this.EntryForm?.value.amount) == "0.00") {
      this.messagesComponent?.showError("Fill the details");
    }
    else {
      if (this.OperationBtnText == "Add") {
        this.addDetails();
      } else {
        this.updateSelectedEntry();
      }
    }
  }

  ClearEntryDetails() {
    this.EntryForm?.patchValue({
      branchCode: '',
      accCode: '',
      amount: '0.00',
      drCr: true,
    })
    this.OperationBtnText = "Add"
  }

  addDetails() {
    if (this.entryDetailsList.filter(en => en.branchCode === this.EntryForm?.value.branchCode
      && en.accCode === this.EntryForm?.value.accCode
      && en.drCr === (this.EntryForm?.value.drCr == true ? "CR" : "DR")
      && en.amount === formatNumber(this.EntryForm?.value.amount)
    ).length > 0) {
      this.messagesComponent?.showError("This entry is already exists");
    }
    else {
      this.entryDetailsList.push({
        branchCode: this.EntryForm?.value.branchCode,
        accCode: this.EntryForm?.value.accCode,
        amount: formatNumber(this.EntryForm?.value.amount),
        drCr: (this.EntryForm?.value.drCr == true ? "CR" : "DR"),
        branchName: this.branches.filter(branch => branch.code === this.EntryForm?.value.branchCode)[0].name,
        cr: (this.EntryForm?.value.drCr == true ? formatNumber(this.EntryForm?.value.amount) : ""),
        dr: (this.EntryForm?.value.drCr == true ? "" : formatNumber(this.EntryForm?.value.amount)),
        id: 0,
        headerId: 0,
        seqNo: 0
      })
      this.debitTotal = this.debitTotal + (this.EntryForm?.value.drCr == true ? 0 : Number(this.EntryForm?.value.amount))
      this.creditTotal = this.creditTotal + (this.EntryForm?.value.drCr == true ? Number(this.EntryForm?.value.amount) : 0)
      this.debitTotalFormated = formatNumber(this.debitTotal)
      this.creditTotalFormated = formatNumber(this.creditTotal)
      this.ClearEntryDetails();
    }

    this.dt2!.filterGlobal('', 'contains');
  }

  selectToUpdate(entryDetail: EntryDetails) {
    this.entryDetailsObj = entryDetail
    this.EntryForm?.patchValue({
      branchCode: entryDetail.branchCode,
      accCode: entryDetail.accCode,
      amount: Number(entryDetail.amount!.replace(/,/g, "")),
      drCr: (entryDetail.drCr == "CR" ? true : false),
    })
    this.selectedCurrentIndex = this.entryDetailsList.findIndex(en =>
      en.branchCode === entryDetail.branchCode &&
      en.accCode === entryDetail.accCode &&
      en.drCr === entryDetail.drCr &&
      en.amount === entryDetail.amount
    );
    this.OperationBtnText = "Update"
  }

  updateSelectedEntry() {
    const branchCode = this.entryDetailsObj.branchCode;
    const accCode = this.entryDetailsObj.accCode;
    const drCr = this.entryDetailsObj.drCr;
    const amount = this.entryDetailsObj.amount;

    this.debitTotal = this.debitTotal - (drCr == 'CR' ? 0 : Number(amount!.replace(/,/g, "")))
    this.creditTotal = this.creditTotal - (drCr == 'DR' ? 0 : Number(amount!.replace(/,/g, "")))

    const entryIndex = this.entryDetailsList.findIndex(en =>
      en.branchCode === branchCode &&
      en.accCode === accCode &&
      en.drCr === drCr &&
      en.amount === amount
    );

    const alreadyExistsIndex = this.entryDetailsList.findIndex(en => en.branchCode === this.EntryForm?.value.branchCode
      && en.accCode === this.EntryForm?.value.accCode
      && en.drCr === (this.EntryForm?.value.drCr == true ? "CR" : "DR")
      && en.amount === formatNumber(this.EntryForm?.value.amount)
    )

    if (alreadyExistsIndex!=entryIndex && alreadyExistsIndex!=-1) {
      this.messagesComponent?.showError("This entry is already exists");
    }
    else if (entryIndex !== -1) {
      // Update the entry
      this.entryDetailsList[entryIndex] = {
        branchCode: this.EntryForm?.value.branchCode,
        accCode: this.EntryForm?.value.accCode,
        drCr: this.EntryForm?.value.drCr == true ? "CR" : "DR",
        amount: formatNumber(this.EntryForm?.value.amount),
        branchName: this.branches.filter(branch => branch.code === this.EntryForm?.value.branchCode)[0].name,
        cr: (this.EntryForm?.value.drCr == true ? formatNumber(this.EntryForm?.value.amount) : ""),
        dr: (this.EntryForm?.value.drCr == true ? "" : formatNumber(this.EntryForm?.value.amount)),
        id: 0,
        headerId: 0,
        seqNo: 0
      };

      this.debitTotal = this.debitTotal + (this.EntryForm?.value.drCr == true ? 0 : Number(this.EntryForm?.value.amount))
      this.creditTotal = this.creditTotal + (this.EntryForm?.value.drCr == true ? Number(this.EntryForm?.value.amount) : 0)
      this.debitTotalFormated = formatNumber(this.debitTotal)
      this.creditTotalFormated = formatNumber(this.creditTotal)
      this.ClearEntryDetails();
    }
  }

  delete(entryDetail: EntryDetails) {
    const branchCode = entryDetail.branchCode;
    const accCode = entryDetail.accCode;
    const drCr = entryDetail.drCr;
    const amount = entryDetail.amount;

    this.entryDetailsList = this.entryDetailsList.filter(en =>
      !(en.branchCode === branchCode && en.accCode === accCode && en.drCr === drCr && en.amount === amount)
    );

    this.debitTotal = this.debitTotal - (entryDetail.drCr == 'CR' ? 0 : Number(amount!.replace(/,/g, "")))
    this.creditTotal = this.creditTotal - (entryDetail.drCr == 'DR' ? 0 : Number(amount!.replace(/,/g, "")))
    this.debitTotalFormated = formatNumber(this.debitTotal)
    this.creditTotalFormated = formatNumber(this.creditTotal)

    this.dt2!.filterGlobal('', 'contains');
  }

  SelectCustomerFromSearch(customer: Customer) {
    this.EntryForm?.patchValue({
      customerCode: customer.code
    })
  }

  SaveEntryHeader(){
    if(this.debitTotal!=this.creditTotal){
      this.messagesComponent?.showError("Total credit and debit is not equal");
    }else{
      this.entryHeaderObj.isReversal = false
      this.entryHeaderObj.amount = this.creditTotalFormated
      this.entryHeaderObj.narration = this.EntryForm?.value.narration
      this.entryHeaderObj.narration = this.EntryForm?.value.narration
      this.entryHeaderObj.payMethod = this.EntryForm?.value.payMethod
      this.entryHeaderObj.userId = this.userid
      this.entryHeaderObj.entryType = this.enType
      this.entryHeaderObj.entryDetails = this.entryDetailsList
      this.entryHeaderObj.entryDate = this.EntryForm?.value.entryDate
      this.entryHeaderObj.customerCode = this.EntryForm?.value.customerCode

      this.accountsService.InsertEntry(this.entryHeaderObj)
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.messagesComponent!.showSuccess('Successfully inserted - Entry No is '+data.data[0].entryNo)
            this.clearAll();
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

  clearAll(){
    this.EntryForm?.reset();
    this.entryDetailsList = [];
    this.debitTotal = 0;
    this.creditTotal = 0;
    this.debitTotalFormated = formatNumber(this.debitTotal)
    this.creditTotalFormated = formatNumber(this.creditTotal)
  }
}
