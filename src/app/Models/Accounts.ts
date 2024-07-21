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

export class Accounts{    
    id : number | undefined;
    code : string | undefined;
    subAccCode : string | undefined;
    name : string | undefined;
    userId : number | undefined;
}