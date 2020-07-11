import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubsciptions$: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private stroe: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubsciptions$ = this.stroe.select('user')
      .pipe(
        filter( ({ user }) => user != null)
      )
      .subscribe( ({ user }) => this.nombre = user.nombre);

  }

  ngOnDestroy() {
    this.userSubsciptions$.unsubscribe();
  }
  logout() {
    this.authService.logout().then(
      () => {
        this.router.navigate(['login']);
      });
  }
}
