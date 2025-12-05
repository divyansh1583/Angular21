import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () => import('./components/login.component').then((m) => m.LoginComponent),
	},
	{
		path: 'register',
		canActivate: [guestGuard],
		loadComponent: () => import('./components/register.component').then((m) => m.RegisterComponent),
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./components/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login'
	}
];
