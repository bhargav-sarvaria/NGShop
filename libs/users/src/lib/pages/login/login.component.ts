import { Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth-guard.service';
import firebase from 'firebase/app';
import "firebase/auth"
import "firebase/firestore"
import { Environment, ENVIRONMENT } from '@shreeshakti/environment';

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
  reCaptchaVerifier: any;
  showOtp = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''   
  }
  otp!: string;
  verify: string;
  submittedNo: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authGuardService: AuthGuard,
    private localStorageService: LocalstorageService,
    private router: Router,
    @Inject(ENVIRONMENT) private env: Environment
  ) {
    firebase.initializeApp(env.firebaseConfig);
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
      password: [''],
      otp: ['']
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

  getOTP(){
    if(this.loginFormGroup.invalid) return;
    this.setAuthMessage(false, '');
    const mobileNo = '+91' + this.loginForm.phone.value;

    this.authService.phoneNumberExists(this.loginForm.phone.value).pipe(takeUntil(this.endsubs$)).subscribe( (flag) => {
      if(flag){
        this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {size: 'invisible'});
        firebase.auth().signInWithPhoneNumber(mobileNo, this.reCaptchaVerifier).then((confirmationResult) => {
          this.localStorageService.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
          this.verify = confirmationResult.verificationId;
          this.showOtp = true;
          this.submittedNo = this.loginForm.phone.value;
        });
      }else{
        this.setAuthMessage(true, 'Phone number does not exist!');
      }
    }, (error) => {
      if(error.status != 400){
        this.setAuthMessage(true, 'Error in the server, please try again later!');
      }else{
        this.setAuthMessage(true, error.error);
      }
    });
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  submitOtp() {
    if(this.otp.length < 6) return;

    const credential = firebase.auth.PhoneAuthProvider.credential(this.verify, this.otp); 
    firebase.auth().signInWithCredential(credential).then((response) => {
      this.localStorageService.setFirebaseUserData(JSON.stringify(response));
      this.authService.loginWithOtp(this.submittedNo).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
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
    }).catch((error) => {
      console.log(error);
      this.setAuthMessage(true, error.message);
    })
  }
}


// auth/invalid-verification-code
// auth/network-request-failed
