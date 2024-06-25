import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { FireAuthComponent } from './fire-auth/fire-auth.component';
const routes: Routes = [
    {path:'', redirectTo:'/list',pathMatch:"full"},
    {path:'list', component:ItemsListComponent },
    {path:'list/:item_id', component:ItemsListComponent },
    {path:'form', component:ItemFormComponent },
    {path:'add', component:AddItemComponent},
    {path:'signup', component:FireAuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
