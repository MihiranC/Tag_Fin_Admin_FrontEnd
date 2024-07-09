import { Component, ViewChild } from '@angular/core';
import { Accounts, Notes } from '../../Models/Demo';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { PrimeConfig } from '../../prime.config';
import { AccountService } from '../../Services/Account.service';
import { AllAccountSummery } from '../../Models/AccountDetails';
import { EncryptionService } from '../../Services/encryption.service';
import { error } from 'console';
import { MessagesComponent } from '../../messages/messages.component';
import { UserService } from '../../Services/User.service';
import { Users } from '../../Models/UserModel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(
    public UserService: UserService,    
  ) { }
  
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  Users : Users[] = []

  ngOnInit() {
  };


  

}


