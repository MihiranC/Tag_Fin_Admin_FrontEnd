// export class Response {
//     success: boolean = true;
//     message : string = '';
//     errorType: string = '';
//     data : any[] | undefined;
//     exceptionNumber : number = 0;
//  }

export class Response {
    code : string | undefined;
    description: string | undefined;
    data: any[] | undefined;
 }

//  export interface ResponseWithoutDecripted {
//     success: boolean ;
//     message : string ;
//     errorType: string ;
//     resdata : string ;
//     exceptionNumber : number ;
//  }