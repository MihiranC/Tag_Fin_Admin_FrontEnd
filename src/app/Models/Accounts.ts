export class MainAccCategories{
    name : string | undefined;
    code : string | undefined;
}

export class SubAccCategories{    
    id : number | undefined;
    code : string | undefined;
    mainAccCode : string | undefined;
    mainAccCategory : string | undefined;
    name : string | undefined;
    userId : number | undefined;
}


export class EntryDetails{     
    id : number | undefined; 
    headerId : number | undefined;
    seqNo : number | undefined;
    branchCode : string | undefined;
    accCode : string | undefined;
    amount : string | undefined;
    drCr : string | undefined;
    payMethod : string | undefined;

    
    branchName : string | undefined;
    cr : string | undefined;
    dr : string | undefined;
}

export class EntryHeader{    
    id : number | undefined;
    entryNo : string | undefined;
    isReversal : boolean | undefined;
    amount : string | undefined;
    reversalEntryNo : string | undefined;
    narration : string | undefined;
}

export class Accounts{    
    id : number | undefined;
    code : string | undefined;
    subAccCode : string | undefined;
    name : string | undefined;
    userId : number | undefined;
}