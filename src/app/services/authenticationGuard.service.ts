import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase/app';
import { map, take } from 'rxjs/operators';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    user: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth, private router: Router) {
        this.user = afAuth.authState;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.user.pipe(map((auth) => {
            if (!auth) {
                this.router.navigateByUrl('/login');
                return false;
            }
            return true;
        }), take(1));
    }
}
