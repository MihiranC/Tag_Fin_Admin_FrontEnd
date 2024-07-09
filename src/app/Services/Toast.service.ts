import { Injectable } from '@angular/core';

import { GlobalService } from './Global.service';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './Http.service';
import { Response } from '../Models/Response';
import { MessageService } from 'primeng/api';


@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private GlobalService: GlobalService,
        private Http: HttpClient,
        private HttpService: HttpService,
        private messageService: MessageService
    ) { }

    showSuccess(errorContent: string) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: errorContent , key:'tc' });
    }

    showInfo(errorContent: string){
        this.messageService.add({ severity: 'info', summary: 'Info', detail: errorContent , key:'tc' });
    }

    showWarn(errorContent: string) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: errorContent , key:'tc' });
    }

    showError(errorContent: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorContent, key:'tc' });
    }


}
