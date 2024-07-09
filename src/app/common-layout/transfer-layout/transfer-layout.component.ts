import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TransferTypes } from '../../Models/Demo';
import { PrimeConfig } from '../../prime.config';
import { log } from 'console';

@Component({
  selector: 'app-transfer-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule,PrimeConfig],
  templateUrl: './transfer-layout.component.html',
  styleUrl: './transfer-layout.component.scss'
})

export class TransferLayoutComponent {

  constructor(private router: Router) {}
  transferTypes: TransferTypes[] = [];

  ngOnInit() {
    this.transferTypes = [
        { name: 'Third-Party Registered', route: 'TPR' },
        { name: 'Third-Party New', route: '/app/transfers/thirtpartynew' },
        { name: 'Own Account',route: '/app/transfers/ownaccount' },
        { name: 'Payee', route: '/app/transfers/transferpayee' }
    ];
  }

  goTo(to : string){
    const submenu = document.querySelector('.'+to) as HTMLElement;
    const allSubmenus = document.querySelectorAll('.custom-tab');
    allSubmenus.forEach((submenu) => {
      submenu.classList.remove('tab-selected');
    });

    if (submenu) {
        submenu.classList.toggle('tab-selected');
    }

    if(to=='payee'){
      this.router.navigate(['app/transfers/transferpayee']);
    }else if(to=='registered'){
      this.router.navigate(['app/transfers/thirtpartyregister']);
    }else if(to=='thirdpartynew'){
      this.router.navigate(['app/transfers/thirtpartynew']);
    }
    else if(to=='ownaccount'){
      this.router.navigate(['app/transfers/ownaccount']);
    }
  }
}
