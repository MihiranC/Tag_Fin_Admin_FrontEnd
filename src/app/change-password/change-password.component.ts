import { ChangePassword } from '../Models/ChangePasswordModel';

import { Component, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PrimeConfig } from '../prime.config';

import { LoginService } from '../Services/Login.service';
import { Router} from '@angular/router';
import { MessagesComponent } from '../messages/messages.component';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {


  constructor(
    public LoginService: LoginService,
    public router: Router,
    private zone: NgZone,
    private fb: FormBuilder,

  ) {
    this.ChangePasswordForm = this.fb.group({
      userInput: new FormControl('', Validators.required)
    });

   }

  @ViewChild(FormGroupDirective, { static: false }) ChangePasswordFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  ChangePasswordForm: FormGroup | undefined;

  ChangePasswordObject: ChangePassword = new ChangePassword();
  ChangePasswordList: ChangePassword[] | undefined;

  
  backgroundImageUrls: string[] = [
    'url(../../assets/Images/LogingBGs/1.png)',
    'url(../../assets/Images/LogingBGs/2.png)',
    'url(../../assets/Images/LogingBGs/3.png)',
    'url(../../assets/Images/LogingBGs/4.png)',
    'url(../../assets/Images/LogingBGs/5.png)'
  ];

  currentBackgroundIndex : number = 0;
  currentBackgroundImageUrl : string | undefined;
  timer$: Subscription |undefined

  ngOnInit(): void {
    this.changeBackgroundImage();
  }

  changeBackgroundImage() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImageUrls.length;
          this.currentBackgroundImageUrl = this.backgroundImageUrls[this.currentBackgroundIndex];
        });
        this.changeBackgroundImage();
      }, 5000); // Change image every 5 seconds (5000 milliseconds)
    });
  }


  ChangePasswordForUserRequest(){
    var parameter = 'userInput=' + this.ChangePasswordForm?.value.userInput;
    this.ChangePasswordList = [];
    this.LoginService.ChangePasswordForUserRequest(parameter)
    .subscribe({
      next: (data: any) => {
        if (data.code == '1000') {
          data.data!.forEach((item: { userID: string | undefined,username: string | undefined }) => {
            let ChangePasswordObject = new ChangePassword();
            ChangePasswordObject.userID = item.userID;
            ChangePasswordObject.username = item.username;
            sessionStorage.setItem("userID", ChangePasswordObject.userID!);
            sessionStorage.setItem("username", ChangePasswordObject.username!);
            this.router.navigate(['/ResetPassword']);
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
}

