export class CapitalizedCharges{
    amount : string | undefined;
    code : string | undefined;
}

export class Schedule
{
    rentalNumber : string | undefined;
    netRental : string | undefined;
    capital : string | undefined;
    capitalBalance : string | undefined;
    interestPortion : string | undefined;
    interestBalance : string | undefined;
    chargePortionPrincipal : string | undefined;
    chargePortionPrincipalBalance : string | undefined;
    chargePortionInterest : string | undefined;
    interestBalanceOnCharges : string | undefined;
    effectiveInterestRate : string | undefined;
    capitalizedChargeDetails : CapitalizedSchedule[] = []
}

export class CapitalizedSchedule
{
    charge : string | undefined;
    chargeCode : string | undefined;
    rentalNumber : string | undefined;
    netRental : string | undefined;
    capital : string | undefined;
    capitalBalance : string | undefined;
    interestPortion : string | undefined;
    interestBalance : string | undefined;
    chargePortionPrincipal : string | undefined;
    chargePortionPrincipalBalance : string | undefined;
    chargePortionInterest : string | undefined;
    interestBalanceOnCharges : string | undefined;
    effectiveInterestRate : string | undefined;
}

export class ScheduleInputs
{
    loanAmount : string | undefined;
    numberOfMonths : string | undefined;
    annualInterestRate : string | undefined;
    capitalizedCharges : CapitalizedCharges[] | undefined;
    isACapitalizedCharge : boolean | undefined;
    calMethodCode : string | undefined;
}