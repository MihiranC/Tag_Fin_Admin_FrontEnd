import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesComponent } from '../../messages/messages.component';
import { PrimeConfig } from '../../prime.config';
import { AppWiseChargers, CalDetails, CalMethodFrequency, CalMethods, Chargers, Products } from '../../Models/Application';
import { CapitalizedCharges, CapitalizedSchedule, Schedule, ScheduleInputs } from '../../Models/Schedule';
import { ApplicationService } from '../../Services/Application.service';
import { formatNumber } from '../../common-functions/number';
import { CalGenerateComponent } from '../CommonControllers/cal-generate/cal-generate.component';

@Component({
  selector: 'app-generate-application',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent, CalGenerateComponent],
  templateUrl: './generate-application.component.html',
  styleUrl: './generate-application.component.scss'
})
export class GenerateApplicationComponent {
  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;
  @ViewChild(CalGenerateComponent) calGenerateComponent: CalGenerateComponent | undefined;

  formData: any = {};
  AppForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    public applicationService: ApplicationService,
  ) {
    this.AppForm = this.fb.group({
      appCode: new FormControl(''),
      calNo: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  SelectCalNo(calDetails: CalDetails) {
    this.AppForm?.patchValue({
      calNo: calDetails.code
    })
  }

}
