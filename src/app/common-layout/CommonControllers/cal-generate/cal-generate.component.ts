import { Component, output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { PrimeConfig } from '../../../prime.config';
import { MessagesComponent } from '../../../messages/messages.component';
import { AppWiseChargers, CalDetails, CalMethodFrequency, CalMethods, Chargers, Products } from '../../../Models/Application';
import { CapitalizedCharges, CapitalizedSchedule, Schedule, ScheduleInputs } from '../../../Models/Schedule';
import { ApplicationService } from '../../../Services/Application.service';
import { convertToNumber, formatNumber } from '../../../common-functions/number';

@Component({
  selector: 'app-cal-generate',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeConfig, MessagesComponent],
  templateUrl: './cal-generate.component.html',
  styleUrl: './cal-generate.component.scss'
})
export class CalGenerateComponent {
  visible: boolean = false;

  @ViewChild(FormGroupDirective, { static: false }) UserFormDirective: FormGroupDirective | undefined
  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;

  formData: any = {};
  CalForm: FormGroup | undefined;

  //productdetils
  products: Products[] = []
  calMethods: CalMethods[] = []
  calMethodFrequency: CalMethodFrequency[] = []
  ScheduleInputsObj: ScheduleInputs = new ScheduleInputs();
  chargers: Chargers[] = []
  appWiseChargers: AppWiseChargers[] = []

  //Schedule
  schedule: Schedule[] = []
  capitalizedCharges: CapitalizedCharges[] = []

  expandedRows = {};

  getSelected = output<CalDetails>();

  //summary
  _LoanAmount: string = ''
  _NoofInstallements: string = ''
  _Rate: string = ''
  _NetRental: string = ''
  _TotalCapital: string = ''
  _TotalInterest: string = ''
  _TotalCapitalonChargers: string = ''
  _TotalInterestonChargers: string = ''
  _NewInterestRateAfterCapitalized: string = ''
  _TotalReceivable: string = ''

  constructor(
    private fb: FormBuilder,
    public applicationService: ApplicationService,
  ) {
    this.CalForm = this.fb.group({
      productCode: new FormControl(''),
      calMethod: new FormControl(''),
      calMethodFrequency: new FormControl(''),
      noOfInstallements: new FormControl(''),
      loanAmount: new FormControl(''),
      anualRate: new FormControl(''),
      chargeCode: new FormControl(''),
      chargeAmount: new FormControl('0.00'),
      isCapitalaized: [false],
    });
  }

  OpenCalGenerate() {
    this.visible = true;
    this.selectProducts()
    this.selectCalMethods()
    this.selectChargers()
  }

  selectProducts() {
    this.products = []
    this.products.push({
      code: "L",
      name: "Lease"
    })
  }

  selectCalMethods() {
    this.calMethods = []
    this.calMethods.push({
      code: "RB",
      name: "Reducing Balance"
    })
  }

  selectChargers() {
    this.chargers = []
    this.chargers.push({
      code: "SD",
      name: "Stamp duty"
    },
    {
      code: "PC",
      name: "Paper charge"
    })
  }

  GenerateSchedule() {
    //this.schedule = [];
    this.ScheduleInputsObj.loanAmount = String(this.CalForm!.value.loanAmount);
    this.ScheduleInputsObj.numberOfMonths = String(this.CalForm!.value.noOfInstallements);
    this.ScheduleInputsObj.annualInterestRate = String(this.CalForm!.value.anualRate);
    this.ScheduleInputsObj.capitalizedCharges = this.capitalizedCharges;
    this.ScheduleInputsObj.isACapitalizedCharge = false;
    this.ScheduleInputsObj.calMethodCode = this.CalForm!.value.calMethod;

    this.applicationService.GenerateSchedule(this.ScheduleInputsObj)
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.schedule = data.data;

            this._LoanAmount = this.schedule[0].capitalBalance!
            this._NoofInstallements = formatNumber(Number(this.CalForm!.value.noOfInstallements))
            this._Rate = formatNumber(Number(this.CalForm!.value.anualRate)) + '%'
            this._NetRental = this.schedule[0].netRental!
            this._TotalCapital = this.schedule[0].capitalBalance!
            this._TotalInterest = this.schedule[0].interestBalance!
            this._TotalCapitalonChargers = this.schedule[0].chargePortionPrincipalBalance!
            this._TotalInterestonChargers = this.schedule[0].interestBalanceOnCharges!
            this._NewInterestRateAfterCapitalized = this.schedule[0].effectiveInterestRate + '%'!
            this._TotalReceivable = formatNumber(Number(convertToNumber(this.schedule[0].capitalBalance!))
              + Number(convertToNumber(this.schedule[0].interestBalance!))
              + Number(convertToNumber(this.schedule[0].chargePortionPrincipalBalance!))
              + Number(convertToNumber(this.schedule[0].interestBalanceOnCharges!)))

            if (this.capitalizedCharges.length > 0) {
              this.capitalizedCharges.forEach(capCharge => {

                var ScheduleInput = new ScheduleInputs();

                ScheduleInput.loanAmount = String(capCharge.amount);
                ScheduleInput.numberOfMonths = String(this.CalForm!.value.noOfInstallements);
                ScheduleInput.annualInterestRate = String(this.CalForm!.value.anualRate);
                ScheduleInput.capitalizedCharges = [];
                ScheduleInput.isACapitalizedCharge = true;
                ScheduleInput.calMethodCode = this.CalForm!.value.calMethod;

                this.applicationService.GenerateSchedule(ScheduleInput)
                  .subscribe({
                    next: (data: any) => {
                      if (data.code == "1000") {
                        let capSchedule: CapitalizedSchedule[] = data.data;

                        this.schedule.forEach(sdl => {
                          let filteredRentals: CapitalizedSchedule[] = capSchedule.filter(capsdl => capsdl.rentalNumber === sdl.rentalNumber)
                          filteredRentals.forEach(rental => {
                            rental.charge = this.chargers.filter(charge => charge.code === capCharge.code)[0].name;
                            rental.chargeCode = capCharge.code;
                          });
                          if (sdl.capitalizedChargeDetails == null) {
                            sdl.capitalizedChargeDetails = [];
                          }
                          sdl.capitalizedChargeDetails.push(...filteredRentals)
                        });
                      }
                      else {
                        this.messagesComponent!.showError(data.message);
                      }
                    },
                    error: (error: any) => {
                      this.messagesComponent?.showError(error);
                    },
                  });
              })
              console.log('schedule', this.schedule)
            }
          }
          else {
            this.messagesComponent!.showError(data.message);
          }
        },
        error: (error: any) => {
          this.messagesComponent?.showError(error);
        },
      });
  }

  clearChargeForm() {
    this.CalForm?.patchValue({
      chargeCode: '',
      chargeAmount: '',
      isCapitalaized: [false],
    })
  }

  addCharge() {
    if (this.schedule.length <= 0) {
      this.messagesComponent?.showError("Before adding chargers, please generate the schedule");
    } else if (this.appWiseChargers.filter(charge => charge.chargeCode === this.CalForm!.value.chargeCode).length > 0) {
      this.messagesComponent?.showError("Selected charge (" + this.chargers.filter(charge => charge.code === this.CalForm!.value.chargeCode)[0].name + ") is already exits");
    } else if (this.CalForm!.value.chargeCode == "") {
      this.messagesComponent?.showError("Please select a charge to add");
    } else if (Number(this.CalForm!.value.chargeAmount) <= 0) {
      this.messagesComponent?.showError("Invalid charge amount");
    } else {
      this.appWiseChargers.push({
        charge: this.chargers.filter(charge => charge.code === this.CalForm!.value.chargeCode)[0].name,
        chargeCode: this.CalForm!.value.chargeCode,
        amount: formatNumber(this.CalForm!.value.chargeAmount),
        isCapitalized: this.CalForm!.value.isCapitalaized,
      })

      if (this.CalForm!.value.isCapitalaized === true) {
        this.capitalizedCharges.push({
          code: this.CalForm!.value.chargeCode,
          amount: String(this.CalForm!.value.chargeAmount)
        })

        this.GenerateSchedule();
      }
    }
  }

  deleteCharge(charge: AppWiseChargers) {
    this.appWiseChargers = this.appWiseChargers.filter(chg =>
      !(chg.chargeCode === charge.chargeCode)
    );
    if (charge.isCapitalized) {
      this.capitalizedCharges = this.capitalizedCharges.filter(chg =>
        !(chg.code === charge.chargeCode)
      );
      this.GenerateSchedule();
    }
  }

  selectToPage(calDetails: CalDetails) {
    this.getSelected.emit(calDetails);
    this.visible = false;
  }
}
