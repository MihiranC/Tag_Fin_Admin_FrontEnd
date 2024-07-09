import { ChangePassword } from '../Models/ChangePasswordModel';
import { Component, NgZone,ViewChild, } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PrimeConfig } from '../prime.config';

import { LoginService } from '../Services/Login.service';
import { Router} from '@angular/router';
import { MessagesComponent } from '../messages/messages.component';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent { 

  constructor(
    public LoginService: LoginService,
    public router: Router,
    private zone: NgZone,
    private fb: FormBuilder,

  ) {
    this.UserChangePasswordForm = this.fb.group({
      resetcode: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required)
    });

   }

  @ViewChild(FormGroupDirective, { static: false }) ChangePasswordFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  UserChangePasswordForm: FormGroup | undefined;

  username: string = ''
  userId: string = ''
  changePasswordObj: ChangePassword = undefined!;
  

  
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
    this.userId = sessionStorage.getItem("userID")!;
    this.username = sessionStorage.getItem("username")!;
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


  UserChangePassword(){

    this.changePasswordObj = new ChangePassword();
    this.changePasswordObj.userID = this.userId;
    this.changePasswordObj.username = this.username;
    this.changePasswordObj.resetCode = this.UserChangePasswordForm?.value.resetCode;
    this.changePasswordObj.password = this.UserChangePasswordForm?.value.password;

    this.LoginService.UserChangePassword(this.changePasswordObj)
    .subscribe({
      next: (data: any) => {
        if (data.code == '1000') {
          sessionStorage.clear();
          this.router.navigate(['']);
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
