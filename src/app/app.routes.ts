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
            title: 'EvoFin | Home',
            path: 'Dashboard', // child route path
            loadComponent:() => import('./common-layout/dashboard/dashboard.component').then(m=>m.DashboardComponent),
          },
          {
            title: 'EvoFin | Config User',
            path: 'User', // child route path
            loadComponent:() => import('./common-layout/user/user.component').then(m=>m.UserComponent),
          },
          {
            title: 'EvoFin | Config Customers',
            path: 'ConfigCustomers', // child route path
            loadComponent:() => import('./common-layout/customer/customer.component').then(m=>m.CustomerComponent),
          }
        ],
      },
];
