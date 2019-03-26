import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-chat-app';
  signupRoute = false;
  home: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  routeCheck() {
    if (this.router.url != '/login' && this.router.url != '/signup' && this.router.url != '/') {
      if(this.router.url != '/home')
        this.home = true;
      else
      this.home = false;
      this.signupRoute = true
    } else { 
      this.signupRoute = false;
      this.home = false;
    }
    return this.signupRoute;
  }

  login() {
    this.router.navigate(['/login']);
    this.signupRoute = true;
  }

  ngOnInit() {

  }
}
