import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSuscription$: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSuscription$ = this.store.select('ui')
                          .subscribe( ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.uiSuscription$.unsubscribe();
  }
  loginUsuario() {

    if (this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading() );
    // Swal.fire({
    //   title: 'Espere por favor!',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });


    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario(email, password)
    .then( response => {
     // Swal.close();
      // console.log(response);
      this.store.dispatch( ui.stopLoading() );
      this.router.navigate(['/']);
    })
    .catch( err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
        footer: '<a href>Why do I have this issue?</a>'
      });
    });


  }

}
