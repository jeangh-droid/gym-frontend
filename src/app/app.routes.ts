import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { authGuard } from './features/guard/auth-guard';

import { Menucomponent } from './components/menucomponent/menucomponent';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Ejercicioscomponent } from './components/ejercicioscomponent/ejercicioscomponent';
import { Noticiascomponent } from './components/noticiascomponent/noticiascomponent';
import { Perfilcomponent } from './components/perfilcomponent/perfilcomponent';
import { Grupomuscularcomponent } from './components/grupomuscularcomponent/grupomuscularcomponent';
import { Usuarioscomponent } from './components/usuariocomponent/usuario-component';
import { RegistroComponent } from './components/registro-component/registro-component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    {
        path: 'menu',
        component: Menucomponent,
        canActivate: [authGuard],
        children: [
            // Compartidas — ambos roles pueden ver, pero solo lectura para USUARIO
            { path: 'homes', component: Homecomponent },
            { path: 'ejercicios', component: Ejercicioscomponent },
            { path: 'noticias', component: Noticiascomponent },

            // Solo USUARIO
            {
                path: 'perfil',
                component: Perfilcomponent,
                canActivate: [authGuard],
                data: { roles: ['ROLE_USUARIO'] }
            },

            // Solo ADMIN
            {
                path: 'usuarios',
                component: Usuarioscomponent,
                canActivate: [authGuard],
                data: { roles: ['ROLE_ADMIN'] }
            },
            {
                path: 'grupo-muscular',
                component: Grupomuscularcomponent,
                canActivate: [authGuard],
                data: { roles: ['ROLE_ADMIN'] }
            },

            { path: '', redirectTo: 'homes', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];