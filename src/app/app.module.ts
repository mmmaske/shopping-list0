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
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  AngularFireAuth,
  USE_EMULATOR as AUTH_EMULATOR,
} from '@angular/fire/compat/auth';
import { USE_EMULATOR as DATABASE_EMULATOR } from '@angular/fire/compat/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ListContainerFormComponent } from './components/list-container-form/list-container-form.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconChooserComponent } from './icon-chooser/icon-chooser.component';
import { ShareContainerFormComponent } from './components/share-container-form/share-container-form.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgrxStoreComponent } from './ngrx-store/ngrx-store.component';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { counterReducer } from './incrementer.reducer';
import { userReducer } from './user.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { increment } from './incrementer.actions';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import { authReducer } from './auth.reducer';
import { multiSelectReducer } from './multiselect.reducer';
import { authEffects } from './auth.effects';
import { MatBadgeModule } from '@angular/material/badge';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { localStorageSync } from 'ngrx-store-localstorage';
import { multiSelectEffects } from './multiselect.effects';

registerLocaleData(en);
const localStorageSyncReducer = localStorageSync({
  keys: ['counter', 'user', 'auth', 'multiSelect'],
  rehydrate: true,
});
export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
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
    FireAuthComponent,
    SignUpComponent,
    SignInComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    JsonStringifyPipe,
    CameraInputComponent,
    HomeComponent,
    NotfoundComponent,
    NavbarComponent,
    ListContainerComponent,
    ListContainerFormComponent,
    IconChooserComponent,
    ShareContainerFormComponent,
    NgrxStoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    WebcamModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatRippleModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    DragDropModule,
    StoreModule.forRoot({}, { metaReducers }),
    StoreModule.forFeature('counter', counterReducer),
    StoreModule.forFeature('user', userReducer),
    StoreModule.forFeature('auth', authReducer),
    StoreModule.forFeature('multiSelect', multiSelectReducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UserEffects]),
    EffectsModule.forFeature([authEffects]),
    EffectsModule.forFeature([multiSelectEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    HttpClientModule,
  ],
  providers: [
    AuthService, // auth emulator code found here

    // apply firebase firestore emulator
    {
      provide: DATABASE_EMULATOR,
      useValue: environment.production ? undefined : ['localhost', 8080],
    },
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
