export class Inquiry{    
    userId : number | undefined;
    mainAccCode : string | undefined;
    subAccCode : string | undefined;
    customerCode : string | undefined;
    accountNo : string | undefined;
    entryNo : string | undefined;
    fromAmount : string | undefined;
    toAmount : string | undefined;
    fromDate : string | undefined | null;
    toDate: string | undefined  | null;

    
    mainAccCategory: string | undefined;    
    subAccCategory: string | undefined;    
    amount: string | undefined;    
    customerName: string | undefined;    
    drCr: string | undefined;
    entryDate: string | undefined;
}