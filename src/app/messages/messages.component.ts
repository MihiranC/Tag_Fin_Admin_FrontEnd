import { Component } from '@angular/core';
import { PrimeConfig } from '../prime.config';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [PrimeConfig],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  contentBody: string = "";
  isSessionexpired: boolean = false;
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }


  showError(message: string) {
    this.contentBody = message;
    const Content = document.querySelector('.error-content') as HTMLElement;
    if (message == '404') {
      this.isSessionexpired = true;
    }
    else if (Content) {
      Content.classList.add('show');
    }
  }

  showSuccess(message: string) {
    this.contentBody = message;
    const Content = document.querySelector('.success-content') as HTMLElement;
    if (Content) {
      Content.classList.add('show');
    }
  }

  close(div: string) {
    const errorContent = document.querySelector(`.${div}`);
    if (errorContent) {
      errorContent.classList.remove('show');
    }
  }


  confirm() {
    this.isSessionexpired = false;
    this.router.navigate(['']);
  }

}
