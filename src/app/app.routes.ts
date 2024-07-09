import { Routes } from '@angular/router';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'ForgotPassword', component: ChangePasswordComponent },
    { path: 'ResetPassword', component: ResetPasswordComponent },    
    {
        path: 'app',
        loadComponent:() => import('./common-layout/common-layout.component').then(m=>m.CommonLayoutComponent),
        children: [
          {
            title: 'Myfi | Home',
            path: 'Dashboard', // child route path
            loadComponent:() => import('./common-layout/dashboard/dashboard.component').then(m=>m.DashboardComponent),
          },
          {
            title: 'Myfi | Config User',
            path: 'User', // child route path
            loadComponent:() => import('./common-layout/user/user.component').then(m=>m.UserComponent),
          },
          {
            title: 'Bill | Home',
            path: 'billpayments', // child route path
            loadComponent:() => import('./common-layout/bill-payments/bill-payments.component').then(m=>m.BillPaymentsComponent),
          },
          {
            path: 'transfers', // child route path
            loadComponent:() => import('./common-layout/transfer-layout/transfer-layout.component').then(m=>m.TransferLayoutComponent),
            children: [
              {
                title: 'Myfi | Transfer',
                path: 'thirtpartyregister', // transfer child route path
                loadComponent:() => import('./common-layout/transfer-layout/third-party-registered/third-party-registered.component').then(m=>m.ThirdPartyRegisteredComponent),
              },
              {
                title: 'Myfi | Transfer | Payee',
                path: 'transferpayee', // transfer child route path
                loadComponent:() => import('./common-layout/transfer-layout/transfer-payee/transfer-payee.component').then(m=>m.TransferPayeeComponent),
              },
              {
                title: 'Myfi | Transfer | Own Account',
                path: 'ownaccount', // transfer child route path
                loadComponent:() => import('./common-layout/transfer-layout/own-account/own-account.component').then(m=>m.OwnAccountComponent),
              },
              {
                title: 'Myfi | Transfer | Third Party New',
                path: 'thirtpartynew', // transfer child route path
                loadComponent:() => import('./common-layout/transfer-layout/third-party-new/third-party-new.component').then(m=>m.ThirdPartyNewComponent),
              }
            ]
          }
        ],
      },
];
