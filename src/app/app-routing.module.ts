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
const routes: Routes = [
    {path:'', redirectTo:'/list',pathMatch:"full"},
    {path:'list', component:ItemsListComponent },
    {path:'list/:item_id', component:ItemsListComponent },
    {path:'form', component:ItemFormComponent },
    {path:'add', component:AddItemComponent},
    {path:'auth', component:FireAuthComponent},
    {path:'signup', component:SignUpComponent},
    {path:'signin', component:SignInComponent},
    {path:'forgot', component:ForgotPasswordComponent},
    {path:'verifyt', component:VerifyEmailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
