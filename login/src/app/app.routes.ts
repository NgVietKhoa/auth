import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { InternComponent } from './intern/intern.component';
import { InternWSComponent } from './intern/internWS.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'intern', component: InternComponent },
  { path: 'internws', component: InternWSComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];