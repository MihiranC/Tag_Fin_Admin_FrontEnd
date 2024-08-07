import { Component, output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { PrimeConfig } from '../../../prime.config';
import { MessagesComponent } from '../../../messages/messages.component';
import { AppWiseChargers, CalDetails, CalMethodFrequency, CalMethods, Chargers, Products } from '../../../Models/Application';
import { CapitalizedCharges, CapitalizedSchedule, Schedule, ScheduleInputs } from '../../../Models/Schedule';
import { ApplicationService } from '../../../Services/Application.service';
import { convertToNumber, formatNumber } from '../../../common-functions/number';
import { ReferenceService } from '../../../Services/Reference.service';

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
  mandetoryChargers: Chargers[] = []
  nonMandetoryChargers: Chargers[] = []
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

  OperationandUseBtnText : string = "Save and Use"
  OperationBtnText : string = "Save"

  calDetails : CalDetails = new CalDetails();

  userid: number = Number(sessionStorage.getItem('LoggedUserID')!)
  capitalizedSchedule : CapitalizedSchedule[] = []

  constructor(
    private fb: FormBuilder,
    public applicationService: ApplicationService,
    public referenceService: ReferenceService,
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
    //this.selectCalMethods()
    this.selectCalMethodFrequency()
  }

  selectProducts() {
    this.products = []
    this.referenceService.SelectProducts('')
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.products = data.data
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

  loadDataAgainstProducts(product : any){
    this.selectCalMethods(product)
    this.selectChargers(product)
  }

  selectCalMethods(productCode : string) {
    this.calMethods = []
    this.referenceService.SelectProductWiseCalMethods(productCode)
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.calMethods = data.data
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

  selectChargers(productCode : string) {
    this.chargers = []
    this.referenceService.SelectProductWiseChargers('',productCode)
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.chargers = data.data
         this.mandetoryChargers = data.data
         setTimeout(() => {          
          this.nonMandetoryChargers = this.chargers.filter(charge => charge.isMandetory === false)
          this.mandetoryChargers = this.mandetoryChargers.filter(charge => charge.isMandetory === true)

          this.mandetoryChargers.forEach(chgers=>{
            this.appWiseChargers.push({
              chargeCode : chgers.chargeCode,
              amount : chgers.amount,
              charge : this.mandetoryChargers.filter(charge => charge.chargeCode === chgers.chargeCode)[0].chargeName,
              isCapitalized : chgers.isCapitalized,
              isFixed : chgers.isFixed,
              percentage : chgers.percentage,
              deleteEnable : false,
              isMandetory : true
            })
          })
         }, 200);
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

  selectCalMethodFrequency() {
    this.calMethodFrequency = []
    this.referenceService.SelectCalMethdFrequency()
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
         this.calMethodFrequency = data.data
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

  GenerateSchedule() {

    this.capitalizedCharges = []

    this.appWiseChargers.forEach(chg=>{
      if(chg.isMandetory ==true && chg.percentage != 0){
        chg.amount = formatNumber(Number(this.CalForm!.value.loanAmount)*chg.percentage!/100)
      }
      if(chg.isCapitalized){
        this.capitalizedCharges.push({
          code: chg.chargeCode,
          amount: convertToNumber(chg.amount!)
        })
      }
    })

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
            this._Rate = formatNumber(Number(this.CalForm!.value.anualRate))
            this._NetRental = this.schedule[0].netRental!
            this._TotalCapital = this.schedule[0].capitalBalance!
            this._TotalInterest = this.schedule[0].interestBalance!
            this._TotalCapitalonChargers = this.schedule[0].chargePortionPrincipalBalance!
            this._TotalInterestonChargers = this.schedule[0].interestBalanceOnCharges!
            this._NewInterestRateAfterCapitalized = this.schedule[0].effectiveInterestRate!
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
                        this.capitalizedSchedule.push(...capSchedule)

                        this.schedule.forEach(sdl => {
                          let filteredRentals: CapitalizedSchedule[] = capSchedule.filter(capsdl => capsdl.rentalNumber === sdl.rentalNumber)
                          filteredRentals.forEach(rental => {
                            rental.charge = this.chargers.filter(charge => charge.chargeCode === capCharge.code)[0].chargeName;
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
      this.messagesComponent?.showError("Selected charge (" + this.chargers.filter(charge => charge.chargeCode === this.CalForm!.value.chargeCode)[0].chargeName + ") is already exits");
    } else if (this.CalForm!.value.chargeCode == "") {
      this.messagesComponent?.showError("Please select a charge to add");
    } else if (Number(this.CalForm!.value.chargeAmount) <= 0) {
      this.messagesComponent?.showError("Invalid charge amount");
    } else {
      this.appWiseChargers.push({
        charge: this.chargers.filter(charge => charge.chargeCode === this.CalForm!.value.chargeCode)[0].chargeName,
        chargeCode: this.CalForm!.value.chargeCode,
        amount: formatNumber(this.CalForm!.value.chargeAmount),
        isCapitalized: this.CalForm!.value.isCapitalaized,
        isFixed : false,
        percentage : 0.00,
        deleteEnable : true,
        isMandetory : false
      })

      if (this.CalForm!.value.isCapitalaized === true) {
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

  
  saveCal(){
    this.calDetails.productCode = this.CalForm!.value.productCode;
    this.calDetails.calMethod = this.CalForm!.value.calMethod;
    this.calDetails.calFrequency = this.CalForm!.value.calMethodFrequency;
    this.calDetails.loanAmount = String(this.CalForm!.value.loanAmount);
    this.calDetails.period = String(this.CalForm!.value.noOfInstallements);
    this.calDetails.rate = String(this.CalForm!.value.anualRate);
    this.calDetails.totalInterest = this._TotalInterest
    this.calDetails.totalChargeCapital = this._TotalCapitalonChargers
    this.calDetails.totalInterestCharge = this._TotalInterestonChargers
    this.calDetails.newRate = this._NewInterestRateAfterCapitalized
    this.calDetails.totalReceivable = this._TotalReceivable
    this.calDetails.userId = this.userid

    this.calDetails.calWiseChargers = this.appWiseChargers
    this.calDetails.capitalizedBreakup = []
    this.calDetails.calSchedule = []

    this.schedule.forEach(shdl=>{
      this.calDetails.calSchedule?.push({
        rentalNo : shdl.rentalNumber,
        netRental : shdl.netRental,
        capital : shdl.capital,
        capitalBalance : shdl.capitalBalance,
        interest : shdl.interestPortion,
        interestBalance : shdl.interestBalance,
        chargeCapital : shdl.chargePortionPrincipal,
        chargeCapitalBalance : shdl.chargePortionPrincipalBalance,
        chargeInterest : shdl.chargePortionInterest,
        chargeInterestBalance : shdl.interestBalanceOnCharges,
      })
    })

    this.capitalizedSchedule.forEach(shdl=>{
      this.calDetails.capitalizedBreakup?.push({
        rentalNo : shdl.rentalNumber,
        netRental : shdl.netRental,
        capital : shdl.capital,
        capitalBalance : shdl.capitalBalance,
        interest : shdl.interestPortion,
        interestBalance : shdl.interestBalance,
        chargeCapital : shdl.chargePortionPrincipal,
        chargeCapitalBalance : shdl.chargePortionPrincipalBalance,
        chargeInterest : shdl.chargePortionInterest,
        chargeInterestBalance : shdl.interestBalanceOnCharges,
        chargeCode : shdl.chargeCode
      })
    })
    
    if(this.OperationBtnText=="Save"){
      this.applicationService.InsertCaldetails(this.calDetails)
      .subscribe({
        next: (data: any) => {
          if (data.code == "1000") {
            this.messagesComponent!.showSuccess("Successfully inserted - Code : "+data.data[0].code);
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

  }
}
