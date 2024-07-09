import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeConfig } from '../../../prime.config';
import { MessagesComponent } from '../../../messages/messages.component';
import { Bank, BankBranch } from '../../../Models/Transfers';
import { TransferService } from '../../../Services/Transfer.service';
import { Payee, PayeeResponse } from '../../../Models/Payee';
import { PayeeService } from '../../../Services/Payee.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-transfer-payee',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './transfer-payee.component.html',
  styleUrl: './transfer-payee.component.scss',
})
export class TransferPayeeComponent {
  @ViewChild(FormGroupDirective, { static: false }) LoginFormDirective:
    | FormGroupDirective
    | undefined;
  @ViewChild(MessagesComponent) messagesComponent:
    | MessagesComponent
    | undefined;

  payeeGroup: FormGroup | undefined;
  formData: any = {};
  Banks: Bank[] = [];
  BankBranches: BankBranch[] = [];
  Payee: Payee = undefined!;
  PayeeResponse: PayeeResponse[] = [];

  Payeeobject: Payee = new Payee()
  OperationBtnText: string = 'Save'
  payeeID: number | undefined;
  message: string | undefined;

  userId: string = sessionStorage.getItem('userId')!;

  totalPayees: number = 0;
  paginatedPayees: PayeeResponse[] = []; // Assuming your payees are of type any
  allPayees: PayeeResponse[] = []; // Assuming your payees are of type any

  constructor(
    private fb: FormBuilder,
    private TransferService: TransferService,
    private payeeService: PayeeService,
    private confirmationService: ConfirmationService
  ) {
    this.payeeGroup = this.fb.group({
      bank: new FormControl<object | null>(null, Validators.required),
      branch: new FormControl<object | null>(null, Validators.required),
      accountno: new FormControl<object | null>(null, Validators.required),
      accountname: new FormControl<object | null>(null, Validators.required),
      nickname: new FormControl<object | null>(null, Validators.required),
    });
  }

  ngOnInit() {
    this.getBanks();
    this.selectPayee();
  }

  getBanks() {
    this.TransferService.getBanks().subscribe({
      next: (data: any) => {
        if (data.success) {
          this.Banks = data.data!;
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  getBankBranch(bank: string) {
    var parameter = 'BankCode=' + bank;
    this.BankBranches = [];
    this.TransferService.getBankBranches(parameter)
    .subscribe({
      next: (data: any) => {
        if (data.success) {
          this.BankBranches = data.data!;
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  savePayee() {
    this.Payee = new Payee();
    this.Payee.PayeeAccountType = 'PEP';
    this.Payee.UserID = this.userId;
    this.Payee.AccountNo = this.payeeGroup?.value.accountno;
    this.Payee.AccountNickName = this.payeeGroup?.value.nickname;
    this.Payee.AccountName = this.payeeGroup?.value.accountname;
    this.Payee.BranchCode = this.payeeGroup?.value.branch;
    this.Payee.BankCode = this.payeeGroup?.value.bank;

    if (this.OperationBtnText == "Save") {
      this.Payee.ActionStatus = 'I';
      this.message = 'successfully saved'
    }
    else {
      this.Payee.ActionStatus = 'U';
      this.Payee.PayeeID = this.payeeID;
      this.message = 'successfully updated'
    }

    this.payeeService.insertPayee(this.Payee).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.messagesComponent?.showSuccess(this.message!);
          this.selectPayee();
          this.clearForm();
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  selectPayee() {
    var parameter = 'UserID=' + this.userId + '&TransactionType=FTR';
    this.payeeService.selectPayee(parameter).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.PayeeResponse = data.data;
          this.allPayees = data.data;
          this.totalPayees = data.data.length;
          this.paginatedPayees = this.allPayees.slice(0, 4);
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  editPayee(payee: any): void {
    this.OperationBtnText = "Update"
    this.payeeID = payee.payeeID;
    this.getBankBranch(payee.bankCode);
    this.payeeGroup!.patchValue({
      bank: payee.bankCode,
      branch: payee.bankBranchCode,
      accountno: payee.payeeAccountNo,
      accountname: payee.payeeName,
      nickname: payee.payeeNickName
    });
  }

  deletePayee(payee: any): void {
    this.Payee = new Payee();
    this.Payee.PayeeAccountType = 'PEP';
    this.Payee.UserID = this.userId;
    this.Payee.PayeeID = payee.payeeID;
    this.Payee.ActionStatus = 'D';
    this.message = 'successfully deleted'

    this.payeeService.insertPayee(this.Payee).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.messagesComponent?.showSuccess(this.message!);
          this.selectPayee();
          this.clearForm();
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  deleteConfirmation(event: Event, payee: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this payee?',
      header: 'You are going to delete',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.deletePayee(payee)
      },
      reject: () => {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  clearForm() {
    this.payeeGroup!.reset();
    this.BankBranches = [];
    this.OperationBtnText = "Save";
  }

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = event.first + event.rows;
    this.paginatedPayees = this.allPayees.slice(startIndex, endIndex);
  }

  trackByIdx(index: number, item: any) {
    return item.payeeID; // Use the correct property that uniquely identifies each payee
  }

  filterPayee(event: any){
    var filteredPayees = this.allPayees.filter(payee =>
      payee.payeeNickName!.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.PayeeResponse = filteredPayees;
    // this.allPayees = data.data;
    this.totalPayees = filteredPayees.length;
    this.paginatedPayees = this.PayeeResponse.slice(0, 4);
  }

}
