import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth-guard.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginFormGroup: FormGroup;
  authError = false;
  authMessage = '';
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authGuardService: AuthGuard,
    private localStorageService: LocalstorageService,
    private router: Router
  ) {
    if(!this.authGuardService.isAdmin() && this.authGuardService.isAdmin()!=null){
      this.displayNotAdmin();
    }
  }

  ngOnInit(): void {
    this._initLoginForm();
  }
    
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private displayNotAdmin(){
    this.setAuthMessage(true, 'You do not have admin access!');
  }

  private setAuthMessage(error: boolean, message: string){
    this.authError = error;
    this.authMessage = message;
  }

  private _initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: ['', Validators.required]
    })
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  onSubmit(){
    if(this.loginFormGroup.invalid) return;
    this.setAuthMessage(false, '');

    this.authService.login(this.loginForm.phone.value, this.loginForm.password.value).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
      if(!user.token){
        this.setAuthMessage(true, user);
      } else{
        this.setAuthMessage(false, '');
        this.localStorageService.setToken(user.token);
        if(this.authGuardService.isAdmin()){
          this.router.navigate(['/']);
        }else{
          this.displayNotAdmin();
        }
        
      }
    }, (error) => {
      if(error.status != 400){
        this.setAuthMessage(true, 'Error in the server, please try again later!');
      }else{
        this.setAuthMessage(true, error.error);
      }
    });
  }
}
