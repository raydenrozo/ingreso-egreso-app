import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubsCription$: Subscription;
  private _user: Usuario;

  get user() {
    return { ... this._user };
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
       if (fuser) {
         //existe
        this.userSubsCription$ = this.firestore.doc(`${fuser.uid}/Usuario`).valueChanges()
          .subscribe( (firebaseUser: any) => {
            const user = Usuario.fromFireBase( firebaseUser );
            this._user = user;
            this.store.dispatch( authActions.setUser({ user }) );
          });
      } else {
        //no existe
        this._user = null;
        if (this.userSubsCription$) { this.userSubsCription$.unsubscribe(); }
        
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unSetItems());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
   return this.auth.createUserWithEmailAndPassword(email, password)
          // destructuracion del objeto ({ user })
          .then( ({ user }) =>  {
            const newUser = new Usuario( user.uid, nombre, user.email);

            return this.firestore.doc(`${user.uid}/Usuario`).set({ ...newUser });
          });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
   }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fuser => fuser !== null)
    );
  }
}
