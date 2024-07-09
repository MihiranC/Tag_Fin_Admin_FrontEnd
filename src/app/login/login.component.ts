
import { Component, NgZone,ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { PrimeConfig } from '../prime.config';

import { LoginService } from '../Services/Login.service';
import { Response } from '../Models/Response';
import { Router } from '@angular/router';
import { MessagesComponent } from '../messages/messages.component';
import { Login } from '../Models/LoginModel';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @ViewChild(FormGroupDirective, { static: false }) LoginFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;

  formData: any = {};

  ResponseObj: Response = new Response();
  
  LoginObject: Login = new Login()

  LoginForm: FormGroup | undefined;

  LoginList: Login[] | undefined;

  router: any;

  backgroundImageUrls: string[] = [
    'url(../../assets/Images/LogingBGs/financeBG.svg)'
  ];

  currentBackgroundIndex : number = 0;
  currentBackgroundImageUrl : string | undefined;
  timer$: Subscription |undefined
  //private intervalSubscription: Subscription;

  constructor(
    public LoginService: LoginService,
    private fb: FormBuilder,
    public Router: Router,
    private zone: NgZone
  ) {

    this.LoginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    // this.intervalSubscription = interval(5000) // Change image every 5 seconds (5000 milliseconds)
    //   .subscribe(() => {
    //     this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImageUrls.length;
    //   });
  }

  ngOnInit(): void {
    // this.LoginForm = new FormGroup({
    //   username: new FormControl(),
    //   password: new FormControl('', Validators.required)
    // });
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

  Login() {
    this.LoginObject.username = this.LoginForm!.value.username;
    this.LoginObject.password = this.LoginForm!.value.password;
    this.LoginService.verifiedUserCredentials(this.LoginObject)
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            sessionStorage.setItem('LoggedUserID', data.data.userID)
            this.Router.navigate(['/app/Dashboard'])
            this.clearForm();
          } else {
            this.messagesComponent?.showError(data.description);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        },
      });
  }

  clearForm() {
    this.LoginForm!.reset();
    //this.OperationBtnText = "Add";
  }

  // ngOnDestroy() {
  //   if (this.intervalSubscription) {
  //     this.intervalSubscription.unsubscribe();
  //   }
  // }
}
