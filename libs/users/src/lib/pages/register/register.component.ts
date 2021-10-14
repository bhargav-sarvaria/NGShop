import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/user';

@Component({
  selector: 'users-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerFormGroup: FormGroup;
  authError = false;
  authMessage = '';
  endsubs$: Subject<any> = new Subject();
  showProgressBar = false;
  formMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initRegisterForm();
  }
    
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _initRegisterForm(){
    this.registerFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      zip: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    })
  }

  get registerForm() {
    return this.registerFormGroup.controls;
  }

  getFormMessage(): string{
    if(this.registerForm.name.invalid) return 'Please enter valid name'
    if(this.registerForm.email.invalid) return 'Please enter valid email'
    if(this.registerForm.password.invalid) return 'Please enter password'
    if(this.registerForm.confirmPassword.invalid) return 'Please enter confirmation password'
    if(this.registerForm.phone.invalid) return 'Please enter Mobile Number'
    if(this.registerForm.addressLine1.invalid) return 'Please enter Address Line 1'
    if(this.registerForm.addressLine2.invalid) return 'Please enter Address Line 2'
    if(this.registerForm.zip.invalid) return 'Please enter valid zip code'
    if(this.registerForm.terms.invalid) return 'Please agree to the terms before creating account'
    return '';
  }

  onSubmit(){
    console.log(this.registerForm.terms.value)
    if(this.registerFormGroup.invalid){
      this.authError = true;
      this.authMessage = this.getFormMessage();
      return;
    } 

    if(this.registerForm.password.value!= this.registerForm.confirmPassword.value){
      this.authError = true;
      this.authMessage = 'Two passwords do not match';
      return;
    }

    this.authError = false;
    this.authMessage = '';
    this.showProgressBar = true;

    const user: User = {
      name: this.registerForm.name.value,
      email: this.registerForm.email.value,
      password: this.registerForm.password.value,
      phone: this.registerForm.phone.value,
      addressLine1: this.registerForm.addressLine1.value,
      addressLine2: this.registerForm.addressLine2.value,
      zip: this.registerForm.zip.value,
    }

    this.authService.register(user).pipe(takeUntil(this.endsubs$)).subscribe( (user) => {
      this.showProgressBar = false;
      if(!user.token){
        this.authError = true;
        this.authMessage = user;
      } else{
        this.authError = false;
        this.authMessage = '';
        this.localStorageService.setToken(user.token);
        this.router.navigate(['/']);
      }
    }, (error) => {
      this.showProgressBar = false;
      this.authError = true;
      if(error.status != 400){
        this.authMessage = 'Error in the server, please try again later!';
      }else{
        this.authMessage = error.error;
      }
    });
  }
}
