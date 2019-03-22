import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import * as firebase from 'firebase/app';
import { Observable, of} from 'rxjs';
import { AngularFireAuth } from  "@angular/fire/auth";
import { auth } from  'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from  'firebase';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  constructor(public  afAuth:  AngularFireAuth, public  router:  Router, public db: AngularFirestore ) { 

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        console.log(user);
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log(localStorage.user);
      } else {
        localStorage.setItem('user', null);
      }
    })
    
}

async  login(email:  string, password:  string) {

  try {
      await  this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
        res => {
          console.log(res.user.uid);
          this.db.collection("users").doc(res.user.uid).update({
            status: "active"
          })
          console.log("status active");
        }
      )
      
  } catch (e) {
      alert("Error!"  +  e.message);
  }
  }

  async loginWithGoogle(){
    await  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then( res => {
      this.db.collection("users").doc(res.user.uid).set({
        displayName: res.user.displayName,
        email: res.user.email,
        id : res.user.uid,
        status: "active"
      })
      .then(function(){
        console.log("user logged in")
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    }
    )
    
}

async register(email: string, password: string, displayName: string) {
  var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  .then( res => {
    this.db.collection("users").doc(res.user.uid).set({
      displayName: displayName,
      email: res.user.email,
      id : res.user.uid,
      status: "active"
    })
    .then(function(){
      console.log("user added to firestore")
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  })
}

  async logout(){
      
      this.db.collection("users").doc(this.user.uid).update({
        status: "inactive"
      })
      .then(()=> {
        this.afAuth.auth.signOut();
        console.log("user logged out")
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
    });    
    
}

get isLoggedIn(): boolean {
  
  const  user  =  JSON.parse(localStorage.getItem('user'));
  return  user  !==  null;
}

}
