export class MainMenu {
   headerId :number = 0;
   headerName : string = "";
   pages : SubMenu[] = [];
   expanded:boolean| undefined;
   icon:string| undefined;
}

export class SubMenu {
   pageId :number = 0;
   headerId :number = 0;
   pageName : string = "";
   path : string = "";
   class:string| undefined;
   fontsize:string| undefined;
   selected:boolean = false;
 }