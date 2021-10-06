import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginFormGroup: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = "email or password is wrong";
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }
    
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.loginFormGroup.invalid) return;
    this.isSubmitted = false;

    this.authService.login(this.loginForm.email.value, this.loginForm.password.value).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
      this.authError = false;
      this.localStorageService.setToken(user.token);
      this.router.navigate(['/']);
    }, (error) => {
      this.authError = true;
      if(error.status != 400){
        this.authMessage = 'Error in the server, please try again later!';
      }else{
        this.authMessage = error.error;
      }
    });
  }
}
