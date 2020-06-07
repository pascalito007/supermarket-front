// Angular
import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// RxJS
import {Observable, of, Subject} from 'rxjs';
import {finalize, takeUntil, tap} from 'rxjs/operators';
// Translate
import {TranslateService} from '@ngx-translate/core';
// Store
import {Store} from '@ngrx/store';
import {AppState} from '../../../../core/reducers';
// Auth
import {AuthNoticeService, AuthService, Login} from '../../../../core/auth';
import {AngularFireAuth} from '@angular/fire/auth';
import {v4 as uuid} from 'uuid';

/**
 * ! Just example => Should be removed in development
 */
@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];

  private unsubscribe: Subject<any>;

  private returnUrl: any;


  constructor(
    private router: Router,
    private auth: AuthService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, private afAuth: AngularFireAuth, private ngZone: NgZone
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.initLoginForm();
    // redirect back to the returnUrl before login
    //this.route.queryParams.subscribe(params => {
      //this.returnUrl = params.returnUrl || '/';
    //});
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initLoginForm() {
    // demo message to show

    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }

  /**
   * Form Submit
   */
  async submit() {
    const controls = this.loginForm.controls;
    /** check form */
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    const authData = {
      email: controls.email.value,
      password: controls.password.value
    };

    try {
      const response = await this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password);
      console.log(response);
      this.router.navigate(['/dashboard']); // Main page
      this.loading = false;
      this.cdr.markForCheck();
    } catch (error) {
      console.log(error);
      this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
      this.loading = false;
      this.cdr.markForCheck();
    }
  }


  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
