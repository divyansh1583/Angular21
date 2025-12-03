import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'signals-login',
		loadComponent: () => import('./components/signals-login.component').then((m) => m.SignalsLoginComponent),
	},
	{
		path: '',
		pathMatch: 'full',
		// keep root route empty (app.html is the placeholder)
		redirectTo: ''
	}
];
