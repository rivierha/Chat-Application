import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import {AuthenticationGuard} from './services/authenticationGuard.service'
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'home/:id', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'chat/:id', component: ChatRoomComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: "/login", pathMatch: "full"},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
