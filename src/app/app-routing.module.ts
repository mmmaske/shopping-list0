import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { FireAuthComponent } from './fire-auth/fire-auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';
import { SignedinGuard } from './guard/signedin.guard';
const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'list', component:ItemsListComponent, canActivate:[AuthGuard] },
    {path:'list/:item_id', component:ItemsListComponent, canActivate:[AuthGuard] },
    {path:'form', component:ItemFormComponent},
    {path:'add', component:AddItemComponent, canActivate:[AuthGuard]},
    {path:'auth', component:FireAuthComponent},
    {path:'signup', component:SignUpComponent, canActivate:[SignedinGuard]},
    {path:'signin', component:SignInComponent, canActivate:[SignedinGuard]},
    {path:'forgot', component:ForgotPasswordComponent, canActivate:[SignedinGuard]},
    {path:'verify', component:VerifyEmailComponent, canActivate:[SignedinGuard]},
    {path:'**',component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
