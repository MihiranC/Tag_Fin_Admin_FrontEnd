import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeConfig } from '../prime.config';
import { MenuService } from '../Services/Menu.service';
import { MessagesComponent } from '../messages/messages.component';
import { MainMenu, SubMenu } from '../Models/Menu';
import { UserService } from '../Services/User.service';

@Component({
  selector: 'app-common-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, PrimeConfig],
  templateUrl: './common-layout.component.html',
  styleUrl: './common-layout.component.scss'
})
export class CommonLayoutComponent {

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private elementRef: ElementRef,    
    public MenuService: MenuService,
    public UserService: UserService,        
    public Router: Router,
  ) { }


  @ViewChild(MessagesComponent) messagesComponent: MessagesComponent | undefined;

  mainMenues: MainMenu[] = [];
  subMenues: SubMenu[] = [];

  mainTitle: string = "";
  username: string = ''
  userid : number = Number(sessionStorage.getItem("LoggedUserID")!);

  isShownMenu : boolean = false;

  ngAfterViewInit(): void {
    //this.username = 'Gayan';
    //this.username = sessionStorage.getItem("userName")!;
  }

  ngOnInit() {
    this.SelectUser();
    this.loadMenues();
  };


  loadMenues(){
    this.MenuService.GetMemues(this.userid)
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
          this.mainMenues = data.data          
          this.mainTitle = this.mainMenues[0].headerName + " | " + this.mainMenues[0].pages![0].pageName
          this.mainMenues[0].pages![0].selected = true
          this.mainMenues[0].expanded = true 
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  SelectUser(){
    this.UserService.ReturnUsers(this.userid,'')
    .subscribe({
      next: (data: any) => {
        if (data.code == "1000") {
          this.username = data.data[0].firstName
        } else {
          this.messagesComponent?.showError(data.message);
        }
      },
      error: (error: any) => {
        this.messagesComponent?.showError(error);
      },
    });
  }

  showHideMenu() {
    const menu = this.elementRef.nativeElement.querySelector('.nav-bar-container');
    const body = this.elementRef.nativeElement.querySelector('.body-layout');
    if(!this.isShownMenu){
      menu.style.marginLeft = '0em';
      body.style.width = `calc(100vw - 11em)`;
      this.isShownMenu = true;
    }else{
      menu.style.marginLeft = '-11em';
      body.style.width = `calc(100vw)`;
      this.isShownMenu = false;
    }

  }

  goToPage(pageIndex: number, headerIndex: number) {
    this.mainTitle = this.mainMenues[headerIndex].headerName + " | " + this.mainMenues[headerIndex].pages![pageIndex].pageName;
    this.mainMenues[headerIndex].pages![pageIndex].selected = true;
    this.mainMenues[headerIndex].pages!.forEach((submenu, index) => {
      if(index!==pageIndex){
        submenu.selected = false;
      }
    });

    // Set other mainMenu's pages' selected to false
    this.mainMenues.forEach((menu, index) => {
      if (index !== headerIndex) {
        menu.pages!.forEach(submenu => {
          submenu.selected = false;
        });
      }
    });

    this.Router.navigate(['/app/'+this.mainMenues[headerIndex].pages![pageIndex].path])
  }

  logOut(){
    this.Router.navigate(['']);
  }
}
