import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MessagesComponent } from '../../messages/messages.component';
import { PrimeConfig } from '../../prime.config';
import { CustomerSearchComponent } from '../CommonControllers/customer-search/customer-search.component';
import { Customer } from '../../Models/Customer';
import { CustomerService } from '../../Services/Customer.service';
import { UpdateData } from '../../Models/UpdateData';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent, CustomerSearchComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

  mode: string = 'I'
  OperationBtnText: string = 'Save'
  readOnly: boolean | undefined = false;
  formData: any = {};
  CustomerForm: FormGroup | undefined;
  CustomerObj: Customer = new Customer()
  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)
  updateData: UpdateData = new UpdateData()

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
  ) {
    this.CustomerForm = this.fb.group({
      code: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNo: new FormControl('', Validators.required),
      nicNo: new FormControl('', Validators.required),
      nICAddressLine1: new FormControl('', Validators.required),
      nICAddressLine2: new FormControl(),
      nICAddressLine3: new FormControl(),
      nICAddressLine4: new FormControl(),
      permenantAddressLine1: new FormControl('', Validators.required),
      permenantAddressLine2: new FormControl(),
      permenantAddressLine3: new FormControl(),
      permenantAddressLine4: new FormControl(),
      mailingAddressLine1: new FormControl('', Validators.required),
      mailingAddressLine2: new FormControl(),
      mailingAddressLine3: new FormControl(),
      mailingAddressLine4: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.email]),

      sameAsNic: new FormControl<string | null>(null),
      sameAsPerm: new FormControl<string | null>(null)
    });
  }

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild(CustomerSearchComponent) customerSearchComponent: CustomerSearchComponent | undefined;

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.route.queryParams.subscribe(params => {
          this.mode = params['mode'];
          if (this.mode == "U") {
            this.readOnly = false;
            this.OperationBtnText = "Update"
          } else if (this.mode == "V") {
            this.readOnly = true;
          } else if (this.mode == "I") {
            this.readOnly = false;
            this.OperationBtnText = "Save"
          }
          this.clearForm();
        });
      }
    });
  }

  onSubmit() {
    this.CustomerObj.userId = this.userid;
    this.CustomerObj.code = this.CustomerForm!.value.code;
    this.CustomerObj.firstName = this.CustomerForm!.value.firstName;
    this.CustomerObj.lastName = this.CustomerForm!.value.lastName;
    this.CustomerObj.telNo = this.CustomerForm!.value.mobileNo;
    this.CustomerObj.nIC = this.CustomerForm!.value.nicNo;
    this.CustomerObj.nICAddressLine01 = this.CustomerForm!.value.nICAddressLine1;
    this.CustomerObj.nICAddressLine02 = this.CustomerForm!.value.nICAddressLine2;
    this.CustomerObj.nICAddressLine03 = this.CustomerForm!.value.nICAddressLine3;
    this.CustomerObj.nICAddressLine04 = this.CustomerForm!.value.nICAddressLine4;
    this.CustomerObj.permentAddressLine01 = this.CustomerForm!.value.permenantAddressLine1;
    this.CustomerObj.permentAddressLine02 = this.CustomerForm!.value.permenantAddressLine2;
    this.CustomerObj.permentAddressLine03 = this.CustomerForm!.value.permenantAddressLine3;
    this.CustomerObj.permentAddressLine04 = this.CustomerForm!.value.permenantAddressLine4;
    this.CustomerObj.mailingAddressLine01 = this.CustomerForm!.value.mailingAddressLine1;
    this.CustomerObj.mailingAddressLine02 = this.CustomerForm!.value.mailingAddressLine2;
    this.CustomerObj.mailingAddressLine03 = this.CustomerForm!.value.mailingAddressLine3;
    this.CustomerObj.mailingAddressLine04 = this.CustomerForm!.value.mailingAddressLine4;
    this.CustomerObj.email = this.CustomerForm!.value.email;
    if (this.OperationBtnText == "Save") {
      this.customerService.Insert(this.CustomerObj)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully inserted. Customer Code is ' + data.data[0].code)
              this.clearForm();
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
    else {

      this.updateData.newData = this.CustomerObj
      this.updateData.userID = this.userid

      this.customerService.Update(this.updateData)
        .subscribe({
          next: (data: any) => {
            if (data.code == "1000") {
              this.messagesComponent!.showSuccess('Successfully updated')
              this.clearForm();
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

  clearForm() {
    this.CustomerForm!.reset();
  }

  onSameAsNic(event: any): void {
    if (event.checked.length > 0) {
      this.CustomerForm?.patchValue({
        permenantAddressLine1: this.CustomerForm!.value.nICAddressLine1,
        permenantAddressLine2: this.CustomerForm!.value.nICAddressLine2,
        permenantAddressLine3: this.CustomerForm!.value.nICAddressLine3,
        permenantAddressLine4: this.CustomerForm!.value.nICAddressLine4,
      })
    } else {
      this.CustomerForm?.patchValue({
        permenantAddressLine1: '',
        permenantAddressLine2: '',
        permenantAddressLine3: '',
        permenantAddressLine4: '',
      })
    }
  }


  onSameAsPermenant(event: any): void {
    if (event.checked.length > 0) {
      this.CustomerForm?.patchValue({
        mailingAddressLine1: this.CustomerForm!.value.permenantAddressLine1,
        mailingAddressLine2: this.CustomerForm!.value.permenantAddressLine2,
        mailingAddressLine3: this.CustomerForm!.value.permenantAddressLine3,
        mailingAddressLine4: this.CustomerForm!.value.permenantAddressLine4,
      })
    } else {
      this.CustomerForm?.patchValue({
        mailingAddressLine1: '',
        mailingAddressLine2: '',
        mailingAddressLine3: '',
        mailingAddressLine4: '',
      })
    }
  }

  SelectCustomerFromSearch(customer: Customer) {
    this.updateData.oldData = customer;
    this.CustomerForm?.patchValue({
      code: customer.code,
      firstName: customer.firstName,
      lastName: customer.lastName,
      mobileNo: customer.telNo,
      nicNo: customer.nIC,
      nICAddressLine1: customer.nICAddressLine01,
      nICAddressLine2: customer.nICAddressLine02,
      nICAddressLine3: customer.nICAddressLine03,
      nICAddressLine4: customer.nICAddressLine04,
      permenantAddressLine1: customer.permentAddressLine01,
      permenantAddressLine2: customer.permentAddressLine02,
      permenantAddressLine3: customer.permentAddressLine03,
      permenantAddressLine4: customer.permentAddressLine04,
      mailingAddressLine1: customer.mailingAddressLine01,
      mailingAddressLine2: customer.mailingAddressLine02,
      mailingAddressLine3: customer.mailingAddressLine03,
      mailingAddressLine4: customer.mailingAddressLine04,
      email: customer.email,
    })
  }
}
