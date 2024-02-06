import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';


export const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'edit/:id', component: CreatePostComponent},
    {path: 'create', component: CreatePostComponent},
    {path: 'login', component: LoginPageComponent},
    {path: '**', component: MainPageComponent},
];
