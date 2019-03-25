import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { FeedComponent } from './feed/feed.component';
import { MessageComponent } from './message/message.component';
import { InputFormComponent } from './input-form/input-form.component';
import { ErrorComponent } from './error/error.component'

var config = {
  apiKey: "AIzaSyAVLIAbCxJfHVQtb_ZBmZqB_ieEGU7EWoM",
  authDomain: "chat-application-ecfca.firebaseapp.com",
  databaseURL: "https://chat-application-ecfca.firebaseio.com",
  projectId: "chat-application-ecfca",
  storageBucket: "chat-application-ecfca.appspot.com",
  messagingSenderId: "449281740600"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ChatRoomComponent,
    FeedComponent,
    MessageComponent,
    InputFormComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatCardModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [AuthService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
