import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupState = {
    email: '',
    password: '',
    displayName: ''
  };

  userForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    displayName: new FormControl(''),

  });

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
  }

  signup() {
    if (this.userForm.value.password === this.userForm.value.confirmPassword) {
      this.signupState.email = this.userForm.value.email;
      this.signupState.password = this.userForm.value.password;
      this.signupState.displayName = this.userForm.value.displayName;

      this.authService.register(this.signupState.email, this.signupState.password, this.signupState.displayName).then(() => {
        setTimeout(() => { this.router.navigate(['/home']) }, 4000)
      })
      .catch((error)=> {
        alert(error)
      })
    } else {
      this.userForm.controls['confirmPassword'].setErrors({
        'notMatched': true
      });
    }
  }
}
