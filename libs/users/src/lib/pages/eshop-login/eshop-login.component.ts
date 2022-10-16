import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ENVIRONMENT, Environment } from '@shreeshakti/environment';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import firebase from 'firebase/app';
import "firebase/auth"
import "firebase/firestore"
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user';

@Component({
  selector: 'users-eshop-login',
  templateUrl: './eshop-login.component.html',
  styles: [
  ]
})
export class EshopLoginComponent implements OnInit, OnDestroy {


  referer = '/';
  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  
  authError = false; authMessage = '';
  endsubs$: Subject<any> = new Subject();
  
  reCaptchaVerifier: any;
  firebaseOtpConfig = { allowNumbersOnly: true, length: 6, isPasswordInput: false, disableAutoFocus: false, placeholder: '' };

  showOtp = false;
  otp!: string;
  verificationId: string;
  
  submittedNo: string;
  isRegister = false;
  cities = ['Mumbai', 'Chennai'];

  timeLeft = 0;
  interval;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    @Inject(ENVIRONMENT) private env: Environment,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.referer = queryParams.referer;
    });
    this._initFirebase();
    this._initLoginForm();
    const footer = <HTMLElement> document.getElementsByTagName('ngshop-footer')[0];
    footer.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
    const footer = <HTMLElement> document.getElementsByTagName('ngshop-footer')[0];
    footer.style.display = 'block';
  }

  private _initFirebase(){
    if (!firebase.apps.length) {
      firebase.initializeApp(this.env.firebaseConfig);
    } else {
      firebase.app();
    }
  }

  private setAuthMessage(error: boolean, message: string){
    this.authError = error;
    this.authMessage = message;
  }

  private _initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
  }

  private _initRegisterForm(){
    this.registerFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [{value: this.submittedNo, disabled: true}, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      city: [this.cities[0], Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      zip: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]],
      terms: [false, Validators.requiredTrue]
    })
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  get registerForm() {
    return this.registerFormGroup.controls;
  }

  sendOTP(){
    console.log('Sent OTP')
    if(this.loginFormGroup.invalid) return;
    this.setAuthMessage(false, '');
    const mobileNo = '+91' + this.loginForm.phone.value;

    if(!this.reCaptchaVerifier) this.reCaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {size: 'invisible'});
    firebase.auth().signInWithPhoneNumber(mobileNo, this.reCaptchaVerifier).then((confirmationResult) => {
      this.localStorageService.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
      this.verificationId = confirmationResult.verificationId;
      this.showOtp = true;
      this.submittedNo = this.loginForm.phone.value;
      this.startTimer();
    }).catch((error) => {
      console.log(error);
      this.firebaseError(error.code);
    });
  }

  firebaseError(code: string){
    let error = '';
    if(code === 'auth/too-many-requests'){
      error = 'Failed to send OTP, please try again after some time.'
    }

    this.setAuthMessage(true, error);
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  submitOtp() {
    if(this.otp.length < 6) return;
    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp); 
    firebase.auth().signInWithCredential(credential).then((response) => {
      this.localStorageService.setFirebaseUserData(JSON.stringify(response));

      this.authService.phoneNumberExists(this.loginForm.phone.value).pipe(takeUntil(this.endsubs$)).subscribe( (response) => {
        if(response.flag){
          this.setAuthMessage(false, '');
          this.localStorageService.setToken(response.token);
        }else{
          this.disaplayRegisterForm();
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

  getRegisterFormMessage(): string{
    if(this.registerForm.name.invalid) return 'Please enter valid name'
    if(this.registerForm.email.invalid) return 'Please enter valid email'
    if(this.registerForm.phone.invalid) return 'Please enter Mobile Number'
    if(this.registerForm.city.invalid) return 'Please select a valid City'
    if(this.registerForm.addressLine1.invalid) return 'Please enter Address Line 1'
    if(this.registerForm.addressLine2.invalid) return 'Please enter Address Line 2'
    if(this.registerForm.zip.invalid) return 'Please enter valid zip code'
    if(this.registerForm.terms.invalid) return 'Please agree to the terms before creating account'
    return '';
  }

  disaplayRegisterForm(){
    this.isRegister = true;
    this._initRegisterForm();
  }

  registerUser(){
    if(this.registerFormGroup.invalid){
      this.setAuthMessage(true, this.getRegisterFormMessage());
      return;
    }

    this.setAuthMessage(false, '');

    const user: User = {
      name: this.registerForm.name.value,
      email: this.registerForm.email.value,
      phone: this.registerForm.phone.value,
      city: this.registerForm.city.value,
      addressLine1: this.registerForm.addressLine1.value,
      addressLine2: this.registerForm.addressLine2.value,
      zip: this.registerForm.zip.value,
    }

    this.authService.register(user).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
      if(!user.token){
        this.setAuthMessage(true, user);
      } else{
        this.setAuthMessage(false, '');
        this.localStorageService.setToken(user.token);
        this.router.navigate([this.referer]);
      }
    }, (error) => {
      if(error.status != 400){
        this.setAuthMessage(true, 'Error in the server, please try again later!');
      }else{
        this.setAuthMessage(true, error.error);
      }
    });
  }

  startTimer() {
    this.timeLeft = 60;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
