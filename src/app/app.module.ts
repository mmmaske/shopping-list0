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
import { QuantityValidatorDirective } from './directives/quantity-validator.directive';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth';
import { FireAuthComponent } from './fire-auth/fire-auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { JsonStringifyPipe } from './json-stringify.pipe';
import { CameraInputComponent } from './camera-input/camera-input.component';
import { WebcamModule } from 'ngx-webcam';

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
    MatchPasswordDirective,
    QuantityValidatorDirective,
    FireAuthComponent,
    SignUpComponent,
    SignInComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    JsonStringifyPipe,
    CameraInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    WebcamModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
