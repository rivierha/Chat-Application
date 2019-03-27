import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginState = {
    email: '',
    password: ''
  };

  userForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.loginState.email = this.userForm.value.email;
    this.loginState.password = this.userForm.value.password;
    this.authService.login(this.loginState.email, this.loginState.password).then(resolve => {
      setTimeout(() => { this.router.navigate(['/home']) }, 2000)
    });
  }

  click() {
    this.authService.loginWithGoogle().then(resolve => {
      setTimeout(() => { this.router.navigate(['/home']) }, 4000)
    })
      .catch((error) => {
        alert( error)
      })
  }
}
