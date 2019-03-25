import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'firebase';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  provider: any;

  constructor(public afAuth: AngularFireAuth, public router: Router, public db: AngularFirestore) {

    this.afAuth.authState.subscribe(user => {
      if (!user) {
        localStorage.setItem('user', null);
      } else {
        localStorage.setItem('user', JSON.stringify(user))
      }
    })
    this.provider = new firebase.auth.GoogleAuthProvider();

  }


  authUser() {
    return localStorage.user;
  }

  async  login(email: string, password: string) {
    let database1 = this.db;
    let userDoc;
    let userInfo;

    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
        res => {
          this.db.collection("users").doc(res.user.uid).update({
            status: "active"
          })
          userDoc = database1.doc(`users/${res.user.uid}`)
          userInfo = userDoc.valueChanges();
          userInfo.subscribe(data => {
            localStorage.setItem('uid', JSON.stringify(data.id));
            localStorage.setItem('uEmail', JSON.stringify(data.email));
            localStorage.setItem('uName', JSON.stringify(data.displayName));
          })
        }
      )

    } catch (e) {
      alert("Error!" + e.message);
    }
  }

  async loginWithGoogle() {
    let database1 = this.db;
    let userDoc;
    let userInfo;
    if (this.afAuth.authState) {
      await this.afAuth.auth.signInWithPopup(this.provider)
        .then(res => {
          this.db.collection("users").doc(res.user.uid).ref.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                this.db.collection("users").doc(res.user.uid).update({
                  status: "active"
                })
                  .then(function () {
                    userDoc = database1.doc(`users/${res.user.uid}`)
                    userInfo = userDoc.valueChanges();
                    userInfo.subscribe(data => {
                      
                      localStorage.setItem('uid', JSON.stringify(data.id));
                      localStorage.setItem('uEmail', JSON.stringify(data.email));
                      localStorage.setItem('uName', JSON.stringify(data.displayName));
                    })
                    console.log("user logged in")
                  })
                  .catch(function (error) {
                    console.error("Error writing document: ", error);
                  });
              } else {
                this.db.collection("users").doc(res.user.uid).set({
                  displayName: res.user.displayName,
                  email: res.user.email,
                  id: res.user.uid,
                  status: "active"
                })
                  .then(function () {
                    userDoc = database1.doc(`users/${res.user.uid}`)
                    userInfo = userDoc.valueChanges();
                    userInfo.subscribe(data => {
                      localStorage.setItem('uid', JSON.stringify(data.id));
                      localStorage.setItem('uEmail', JSON.stringify(data.email));
                      localStorage.setItem('uName', JSON.stringify(data.displayName));
                    })
                    console.log("user logged in")
                  })
                  .catch(function (error) {
                    console.error("Error writing document: ", error);
                  });
              }

            })
        })
    }
  }

  async register(email: string, password: string, displayName: string) {
    let database1 = this.db;
    let userDoc;
    let userInfo;
    var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.db.collection("users").doc(res.user.uid).set({
          displayName: displayName,
          email: res.user.email,
          id: res.user.uid,
          status: "active"
        })
          .then(function () {
            userDoc = database1.doc(`users/${res.user.uid}`)
            userInfo = userDoc.valueChanges();
            userInfo.subscribe(data => {
              localStorage.setItem('uid', JSON.stringify(data.id));
              localStorage.setItem('uEmail', JSON.stringify(data.email));
              localStorage.setItem('uName', JSON.stringify(data.displayName));
            })
            console.log("user added to firestore")
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      })
  }

  async logout() {
    let uid = JSON.parse(localStorage.uid)
    this.db.collection("users").doc(uid).update({
      status: "inactive"
    })
      .then(() => {
        this.afAuth.auth.signOut();
        console.log("user logged out")
        localStorage.removeItem('uid');
        localStorage.removeItem('uName');
        localStorage.removeItem('uEmail');
        localStorage.removeItem('user');
        localStorage.removeItem('room');
        this.router.navigate(['/login']);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

  }

  get isLoggedIn(): boolean {

    const user = localStorage.getItem('user');
    return user !== null;
  }

}
