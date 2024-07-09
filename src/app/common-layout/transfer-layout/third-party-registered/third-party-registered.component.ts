import { Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimeConfig } from '../../../prime.config';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Accounts, Receipt } from '../../../Models/Demo';
import { AccountService } from '../../../Services/Account.service';
import { AccountNumbers, AllAccountSummery } from '../../../Models/AccountDetails';
import { MessagesComponent } from '../../../messages/messages.component';
import { PayeeService } from '../../../Services/Payee.service';
import { PayeeResponse } from '../../../Models/Payee';
import { Bank, BankBranch, InsertTransfer } from '../../../Models/Transfers'
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { TransferService } from '../../../Services/Transfer.service';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-third-party-registered',
  standalone: true,
  imports: [PrimeConfig, ReactiveFormsModule, MessagesComponent],
  templateUrl: './third-party-registered.component.html',
  styleUrl: './third-party-registered.component.scss'
})
export class ThirdPartyRegisteredComponent {
  items: MenuItem[] = [];
  Accounts: Accounts[] = []
  Receipt: Receipt[] = []
  PayeeResponse: PayeeResponse[] = [];
  activeIndex: number = 0;
  hideTransferSteps: boolean = false;
  otpshow: boolean = false;
  formData: any = {};
  Banks: Bank[] = [];
  BankBranches: BankBranch[] = [];

  selectedAccountNo: string = 'Not Selected'
  selectedAccountNoBalance: string = '0.00'
  selectedAccountNoAvalBalance: string = '0.00'

  AccountNumbers: AccountNumbers[] | undefined = [];
  userId: string = sessionStorage.getItem("userId")!;

  @ViewChild(FormGroupDirective, { static: false }) TransferFormDirective:
    | FormGroupDirective
    | undefined;
  @ViewChild(MessagesComponent) messagesComponent:
    | MessagesComponent
    | undefined;

  TransferFormGroup: FormGroup | undefined;
  InsertTransfer: InsertTransfer | undefined;
  message: string | undefined;

  constructor(
    private fb: FormBuilder,
    private AccountService: AccountService,
    private payeeService: PayeeService,
    private TransferService: TransferService,
    //private datePipe: DatePipe
  ) {

    this.TransferFormGroup = this.fb.group({
      fromAccount: new FormControl(null, Validators.required),
      sendAccount: new FormControl(null, Validators.required),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      confirmAmount: new FormControl(null, Validators.required),
      remarks: new FormControl(null, Validators.required),
      bank: new FormControl<object | null>(null, Validators.required),
      branch: new FormControl<object | null>(null, Validators.required),
    }, { validators: this.amountMatchValidator });

    this.TransferFormGroup.get('bank')?.disable();
    this.TransferFormGroup.get('branch')?.disable();
  }

  amountMatchValidator(group: FormGroup) {
    const amountControl = group.get('amount');
    const confirmAmountControl = group.get('confirmAmount');
    if (amountControl && confirmAmountControl && amountControl.value !== confirmAmountControl.value) {
      confirmAmountControl.setErrors({ amountMismatch: true });
    } else {
      confirmAmountControl!.setErrors(null);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onActiveIndexChange(event: any) {
    this.activeIndex = event;
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Info',
      },
      {
        label: 'Confirmation',
      },
      {
        label: 'Receipt',
      }
    ];

    this.getAccountDetails();
    this.toAccountDetails();
    this.getBanks();
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

  async getAccountDetails() {
    this.AccountNumbers = [];
    var parameter = 'UserID=' + this.userId;
    this.AccountService.getSavingsAccountsForUser(parameter)
      .subscribe({
        next: (data: any) => {
          if (data.success) {
            data.data!.forEach((item: { accountNo: string | undefined, balance: string | undefined, availableBalance: string | undefined }) => {
              let AccountsObj = new AccountNumbers();
              AccountsObj.AccountNo = item.accountNo;
              AccountsObj.AvailableBalance = item.availableBalance;
              AccountsObj.Balance = item.balance;
              this.AccountNumbers?.push(AccountsObj);
            });
          } else {
            this.messagesComponent?.showError(data.message);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        }
      });
  }

  async toAccountDetails() {
    var parameter = 'UserID=' + this.userId + '&TransactionType=FTR';
    this.payeeService.selectPayee(parameter).subscribe({
      next: (data: any) => {
        if (data.success) {
          data.data!.forEach((item: {
            bankBranchName: string | undefined;
            bankName: string | undefined;
            bankBranchCode: string | undefined,
            bankCode: string | undefined,
            payeeNickName: string | undefined,
            payeeAccountNo: string | undefined,
            payeeID: number | undefined;
          }) => {

            let PayeeResponseObj = new PayeeResponse();
            PayeeResponseObj.payeeName = item.payeeNickName + ' | ' + item.payeeAccountNo;
            PayeeResponseObj.payeeAccountNo = item.payeeAccountNo;
            PayeeResponseObj.payeeID = item.payeeID;
            PayeeResponseObj.bankCode = item.bankCode;
            PayeeResponseObj.bankName = item.bankName;
            PayeeResponseObj.bankBranchCode = item.bankBranchCode;
            PayeeResponseObj.bankBranchName = item.bankBranchName;
            PayeeResponseObj.payeeNickName = item.payeeNickName;
            this.PayeeResponse?.push(PayeeResponseObj);
          });
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  showAccountDetails(account: string) {
    var accountDetails = this.AccountNumbers!
      .filter(item => item.AccountNo === this.TransferFormGroup?.value.fromAccount);
    if (accountDetails.length > 0) {
      this.selectedAccountNo = accountDetails[0].AccountNo!
      this.selectedAccountNoBalance = accountDetails[0].Balance!
      this.selectedAccountNoAvalBalance = accountDetails[0].AvailableBalance!
    } else {
      this.selectedAccountNo = 'Not Selected'
      this.selectedAccountNoBalance = '0.00'
      this.selectedAccountNoAvalBalance = '0.00'
    }
  }

  selectPayee(payeeId: number) {
    var payeeDetails = this.PayeeResponse
      .filter(item => item.payeeID === payeeId);

    if (payeeDetails.length > 0) {
      this.getBankBranch(payeeDetails[0].bankCode!);
      this.TransferFormGroup!.patchValue({
        bank: payeeDetails[0].bankCode,
        branch: payeeDetails[0].bankBranchCode,
      });
    }
    else {
      this.getBankBranch('');
      this.TransferFormGroup!.patchValue({
        bank: null,
        branch: null,
      });
    }
  }

  Transfer() {
    this.activeIndex = 1;
    this.items[0].styleClass = 'done';

    this.InsertTransfer = new InsertTransfer();

    var payeeDetails = this.PayeeResponse
      .filter(item => item.payeeID === this.TransferFormGroup?.value.sendAccount);

    this.InsertTransfer.TransferAccountNo = this.TransferFormGroup?.value.fromAccount;
    this.InsertTransfer.ReceiverAccountNo = payeeDetails[0].payeeAccountNo;
    this.InsertTransfer.FundTransferMode = 'IB';
    this.InsertTransfer.FundTransferType = 'RAC';
    this.InsertTransfer.PayeeAccountType = null;
    this.InsertTransfer.PaymentID = 0;
    this.InsertTransfer.PayeeID = this.TransferFormGroup?.value.sendAccount;
    this.InsertTransfer.Amount = this.TransferFormGroup?.value.amount;
    this.InsertTransfer.Narration = this.TransferFormGroup?.value.remarks;
    this.InsertTransfer.TransferMethod = 'RP';
    this.InsertTransfer.TransferType = 'E';
    this.InsertTransfer.Bank = payeeDetails[0].bankCode;
    this.InsertTransfer.BankBranch = payeeDetails[0].bankBranchCode;
    this.InsertTransfer.GLAccountNo = null
    this.InsertTransfer.GLBranch = null
    this.InsertTransfer.ExternalAccountNo = null
    this.InsertTransfer.IBUserID = this.userId;
    this.InsertTransfer.Mode = 'I';
    this.InsertTransfer.InvoiceNo = null
    this.InsertTransfer.OTPAvailable = true;
    this.InsertTransfer.OTP = null;
    this.InsertTransfer.FTID = null;
    this.InsertTransfer.DeliveryOption = 0;
    this.InsertTransfer.IsOTPAvailable = false;
    this.InsertTransfer.FundTransferTxnNo = 0;
    this.InsertTransfer.StandingOrderID = 0;
    this.InsertTransfer.BeneficiaryNarration = null;
    this.InsertTransfer.AccountType = 'E';
    this.InsertTransfer.OtherDatails = 'N';
    this.InsertTransfer.ScheduleType = 'N';
    this.InsertTransfer.TransactionDate = '';
    this.InsertTransfer.Frequency = '';
    this.InsertTransfer.TransactionStartDate = '';
    this.InsertTransfer.TransactionEndDate = '';
    this.InsertTransfer.BankName = payeeDetails[0].bankName;
    this.InsertTransfer.BankBranchName = payeeDetails[0].bankBranchName;
    this.InsertTransfer.PayeeNickName = payeeDetails[0].payeeNickName;


  }


  goBackToInfo() {
    this.activeIndex = 0;
    this.items[0].styleClass = 'notdone';
  }

  ResendOTP(){
    this.InsertTransfer!.OTP = null;
    this.InsertTransfer!.IsOTPAvailable = false;
    this.okToProceed()
  }


  okToProceed() {
    this.TransferService.InsertTransfer(this.InsertTransfer!)
      .subscribe({
        next: (data: any) => {
          if (data.success) {
            this.otpshow = true;
            this.InsertTransfer!.FundTransferTxnNo = data.data[0].fundTransferID;
          } else {
            this.messagesComponent?.showError(data.message);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        },
      });

  }

  goBackFromOTP() {
    this.InsertTransfer!.OTP = null;
    this.InsertTransfer!.IsOTPAvailable = false;
    this.otpshow = false;
  }

  processPayment(inputOTP: string) {
    this.InsertTransfer!.OTP = inputOTP;
    this.InsertTransfer!.IsOTPAvailable = true;

    this.TransferService.InsertTransfer(this.InsertTransfer!)
      .subscribe({
        next: (data: any) => {
          if (data.success) {
            this.otpshow = false;
            this.activeIndex = 2;
            this.items[1].styleClass = 'done';
          } else {
            this.messagesComponent?.showError(data.message);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        },
      });


  }

  Download(){}

  Print(){}
}



