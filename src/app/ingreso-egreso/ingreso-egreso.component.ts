import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  isCargando: boolean = false;
  uiSuscription$: Subscription;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              private ingresoEgresoService$: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto:['', Validators.required]
    });
    this.uiSuscription$ = this.store.select('ui')
                          .subscribe( ui => this.isCargando = ui.isLoading);
  }

  ngOnDestroy() {
    this.uiSuscription$.unsubscribe();
    this.isCargando = false;
  };

  guardar(){

    if (this.ingresoEgresoForm.invalid) { return; }
    this.store.dispatch( ui.isLoading() );

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService$.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch( ui.stopLoading() );
        this.isCargando = false;
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        this.isCargando = false;
        Swal.fire('Error Registro Creado', err.message, 'error');
      });
  }

}
