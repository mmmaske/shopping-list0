import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environments/environment';

import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { FormsModule } from '@angular/forms';
import { CamelCasePipe } from './camel-case.pipe';
import { UppercaseWordsPipe } from './uppercase-words.pipe';
import { GetPriorityColorPipe } from './get-priority-color.pipe';
import { ItemFormComponent } from './item-form/item-form.component';
import { MatchPasswordDirective } from './directives/password-pattern.directive';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    ItemDetailsComponent,
    ItemsListComponent,
    CamelCasePipe,
    UppercaseWordsPipe,
    GetPriorityColorPipe,
    ItemFormComponent,
    MatchPasswordDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
