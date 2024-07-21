import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { Table } from 'primeng/table';
import { EntryDetails, MainAccCategories, SubAccCategories } from '../../Models/Accounts';
import { SettingsService } from '../../Services/Settings.service';
import { AccountsService } from '../../Services/Accounts.service';
import { PrimeConfig } from '../../prime.config';
import { AccountSearchComponent } from '../CommonControllers/account-search/account-search.component';
import { BranchService } from '../../Services/Branch.service';
import { Branch } from '../../Models/Branch';
import { CustomerSearchComponent } from '../CommonControllers/customer-search/customer-search.component';
import { Customer } from '../../Models/Customer';

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

  entryDetailsList: EntryDetails[] = []

  entryDetailsObj: EntryDetails = new EntryDetails();

  drCrOptions: any[] = [{ label: 'DR', value: 'DR' }, { label: 'CR', value: 'CR' }];

  isSelected: boolean = false; // Default value is DR
  debitTotalFormated: string = "0.00"
  creditTotalFormated: string = "0.00"
  debitTotal: number = 0
  creditTotal: number = 0

  selectedCurrentIndex : number = 0;

  constructor(
    private fb: FormBuilder,
    public settingsService: SettingsService,
    public accountsService: AccountsService,
    public branchService: BranchService,
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
    });
  }

  ngOnInit(): void {
    this.loadBranch()
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

  onFilterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }

  SaveEntryDetails() {
    if (this.EntryForm?.value.branchCode == "" || this.EntryForm?.value.accCode == "" || this.formatNumber(this.EntryForm?.value.amount) == "0.00") {
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
      && en.amount === this.formatNumber(this.EntryForm?.value.amount)
    ).length > 0) {
      this.messagesComponent?.showError("This entry is already exists");
    }
    else {
      this.entryDetailsList.push({
        branchCode: this.EntryForm?.value.branchCode,
        accCode: this.EntryForm?.value.accCode,
        amount: this.formatNumber(this.EntryForm?.value.amount),
        drCr: (this.EntryForm?.value.drCr == true ? "CR" : "DR"),
        payMethod: "",
        branchName: this.branches.filter(branch => branch.code === this.EntryForm?.value.branchCode)[0].name,
        cr: (this.EntryForm?.value.drCr == true ? this.formatNumber(this.EntryForm?.value.amount) : ""),
        dr: (this.EntryForm?.value.drCr == true ? "" : this.formatNumber(this.EntryForm?.value.amount)),
        id: 0,
        headerId: 0,
        seqNo: 0
      })
      this.debitTotal = this.debitTotal + (this.EntryForm?.value.drCr == true ? 0 : Number(this.EntryForm?.value.amount))
      this.creditTotal = this.creditTotal + (this.EntryForm?.value.drCr == true ? Number(this.EntryForm?.value.amount) : 0)
      this.debitTotalFormated = this.formatNumber(this.debitTotal)
      this.creditTotalFormated = this.formatNumber(this.creditTotal)
      this.ClearEntryDetails();
    }

    this.dt2!.filterGlobal('', 'contains');
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  selectToUpdate(entryDetail: EntryDetails) {
    this.entryDetailsObj = entryDetail
    this.EntryForm?.patchValue({
      branchCode: entryDetail.branchCode,
      accCode: entryDetail.accCode,
      amount: entryDetail.amount,
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
      && en.amount === this.formatNumber(this.EntryForm?.value.amount)
    )

    if (alreadyExistsIndex!=entryIndex) {
      this.messagesComponent?.showError("This entry is already exists");
    }
    if (entryIndex !== -1) {
      // Update the entry
      this.entryDetailsList[entryIndex] = {
        branchCode: this.EntryForm?.value.branchCode,
        accCode: this.EntryForm?.value.accCode,
        drCr: this.EntryForm?.value.drCr == true ? "CR" : "DR",
        amount: this.formatNumber(this.EntryForm?.value.amount),
        payMethod: "",
        branchName: this.branches.filter(branch => branch.code === this.EntryForm?.value.branchCode)[0].name,
        cr: (this.EntryForm?.value.drCr == true ? this.formatNumber(this.EntryForm?.value.amount) : ""),
        dr: (this.EntryForm?.value.drCr == true ? "" : this.formatNumber(this.EntryForm?.value.amount)),
        id: 0,
        headerId: 0,
        seqNo: 0
      };

      this.debitTotal = this.debitTotal + (this.EntryForm?.value.drCr == true ? 0 : Number(this.EntryForm?.value.amount))
      this.creditTotal = this.creditTotal + (this.EntryForm?.value.drCr == true ? Number(this.EntryForm?.value.amount) : 0)
      this.debitTotalFormated = this.formatNumber(this.debitTotal)
      this.creditTotalFormated = this.formatNumber(this.creditTotal)
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
    this.debitTotalFormated = this.formatNumber(this.debitTotal)
    this.creditTotalFormated = this.formatNumber(this.creditTotal)

    this.dt2!.filterGlobal('', 'contains');
  }

  SelectCustomerFromSearch(customer: Customer) {
    this.EntryForm?.patchValue({
      customerCode: customer.code
    })
  }
}