import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingres-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresoEgreso: IngresoEgreso[] = [];
  ingresosEgresosSubs$: Subscription;
  
  constructor(private store: Store<AppStateWithIngreso>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs$ = this.store.select('ingresosEgresos').subscribe(({ items }) => {
      this.ingresoEgreso = items
    })
  }
  ngOnDestroy() {
    this.ingresosEgresosSubs$.unsubscribe();
  }

  borrar(uid: string) {
    this.ingresoEgresoService.borrarIngresiEgreso(uid)
      .then( () => Swal.fire('Borrar Registro', 'Item Borrado', 'success'))
      .catch( err => Swal.fire('Error', err.message, 'error'));
  }
}
