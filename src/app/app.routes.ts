import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { Home } from './features/home/home';
import { authGuard } from './features/guard/auth-guard';
import { ListaComponent } from './features/usuario/lista-component/lista-component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard],
        children: [
            {path: 'lista-usuarios', component: ListaComponent},
        ]
    },
];
