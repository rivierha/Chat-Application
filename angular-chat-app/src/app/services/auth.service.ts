import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import * as firebase from 'firebase/app';
import { Observable, of} from 'rxjs';
import { AngularFireAuth } from  "@angular/fire/auth";
import { auth } from  'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { User } from  'firebase';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) { 

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log(localStorage.user);
      } else {
        localStorage.setItem('user', null);
      }
    })
}

async  login(email:  string, password:  string) {

  try {
      await  this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/home']);
  } catch (e) {
      alert("Error!"  +  e.message);
  }
  }

  async loginWithGoogle(){
    await  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then( res => {
      console.log("dvcshk");}
    )
    this.router.navigate(['/home']);
}

async register(email: string, password: string, displayName: string) {
  var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  .then()
}

  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    console.log(localStorage);
    this.router.navigate(['/login']);
}

get isLoggedIn(): boolean {
  const  user  =  JSON.parse(localStorage.getItem('user'));
  return  user  !==  null;
}

}
