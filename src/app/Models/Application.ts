import { CapitalizedSchedule, Schedule } from "./Schedule";

export class Products{
    name : string | undefined;
    code : string | undefined;
}

export class CalMethods{
    name : string | undefined;
    code : string | undefined;
}

export class CalMethodFrequency{
    name : string | undefined;
    code : string | undefined;
}

export class Chargers{
    id : string | undefined;
    chargeCode : string | undefined;
    productCode : string | undefined;
    isFixed : boolean | undefined;
    amount : string | undefined;
    percentage : number | undefined;
    isCapitalized : boolean | undefined;
    isActive : boolean | undefined;
    chargeName : string | undefined;
    productName : string | undefined;
    userId : string | undefined;
    isMandetory : boolean | undefined;
}

export class AppWiseChargers{
    chargeCode : string | undefined;
    charge : string | undefined;
    amount : string | undefined;
    isCapitalized : boolean | undefined;
    isFixed : boolean | undefined;
    percentage : number | undefined;
    deleteEnable : boolean | undefined; 
    isMandetory : boolean | undefined;
}

export class CalDetails{
    id : number | undefined = 0;
    code : string | undefined;
    productCode : string | undefined;
    calMethod : string | undefined;
    calFrequency : string | undefined;
    loanAmount : string | undefined;
    period : string | undefined;
    rate : string | undefined;
    totalInterest : string | undefined;
    totalChargeCapital : string | undefined;
    totalInterestCharge : string | undefined;
    newRate : string | undefined;
    totalReceivable : string | undefined;
    userId : number | undefined;

    calWiseChargers : AppWiseChargers[] | undefined = [];
    capitalizedBreakup : CalCapitalizedSchedule[] | undefined = [];
    calSchedule : CalSchedule[] | undefined = [];
}


export class CalSchedule
{   
    id? : number | undefined = 0;
    calId? : number | undefined = 0;
    rentalNo : string | undefined;
    netRental : string | undefined;
    capital : string | undefined;
    capitalBalance : string | undefined;
    interest : string | undefined;
    interestBalance : string | undefined;
    chargeCapital : string | undefined;
    chargeCapitalBalance : string | undefined;
    chargeInterest : string | undefined;
    chargeInterestBalance : string | undefined;
    userId? : number | undefined = 0;
}

export class CalCapitalizedSchedule
{
    chargeCode : string | undefined;
    rentalNo : string | undefined;
    netRental : string | undefined;
    capital : string | undefined;
    capitalBalance : string | undefined;
    interest : string | undefined;
    interestBalance : string | undefined;
    chargeCapital : string | undefined;
    chargeCapitalBalance : string | undefined;
    chargeInterest : string | undefined;
    chargeInterestBalance : string | undefined;
}