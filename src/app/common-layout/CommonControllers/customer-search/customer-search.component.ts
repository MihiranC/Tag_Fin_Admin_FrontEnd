import { Component, output, ViewChild } from '@angular/core';
import { MessagesComponent } from '../../../messages/messages.component';
import { PrimeConfig } from '../../../prime.config';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Users } from '../../../Models/UserModel';
import { Customer } from '../../../Models/Customer';
import { CustomerService } from '../../../Services/Customer.service';

@Component({
  selector: 'app-customer-search',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.scss'
})
export class CustomerSearchComponent {
  visible: boolean = false;
  formData: any = {};
  CustomerForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
  ) {
    this.CustomerForm = this.fb.group({
      code: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobileNo: new FormControl(''),
      nicNo: new FormControl(''),
      records : new FormControl('100'),
      email: new FormControl('', [Validators.email]),
    });
  }

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  Customers : Customer[] = []

  getSelected = output<Customer>();

  OpenSearch() {
      this.visible = true;
      this.CustomerForm!.reset({
        records: '100', // Ensure default value is preserved after reset
        code: '',
        firstName: '',
        lastName: '',
        mobileNo: '',
        nicNo: '',
        email: '',
      });
      this.Customers = [];
  }

  onFilterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, 'contains');
    }
  }

  searchCustomer(){
    if(this.CustomerForm!.value.records==""){
      this.CustomerForm?.patchValue({
        records : 100
      })
    }

    this.customerService.Select(
      this.CustomerForm!.value.code,
      this.CustomerForm!.value.firstName,
      this.CustomerForm!.value.lastName,
      this.CustomerForm!.value.mobileNo,
      this.CustomerForm!.value.nicNo,
      this.CustomerForm!.value.email,
      this.CustomerForm!.value.records
    )
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.Customers = data.data
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

  selectToPage(customer : Customer){
    this.getSelected.emit(customer);
    this.visible = false;
  }
  
}
