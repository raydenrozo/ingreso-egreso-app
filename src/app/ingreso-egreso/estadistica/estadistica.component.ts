import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  // Doughnut
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [
    []
  ];
  public doughnutChartType: ChartType = 'doughnut';

  ingreso: number = 0;
  egreso: number = 0;
  totalIngreso: number = 0;
  totalEgreso: number = 0;

  constructor( private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select('ingresosEgresos')
      .subscribe( ({ items }) => {
        this.generarEstadisticas( items );
      })
  }

  generarEstadisticas( items: IngresoEgreso) {
    this.totalIngreso = 0;
    this.totalEgreso = 0;
    this.ingreso = 0;
    this.egreso = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngreso += item.monto;
        this.ingreso++;
      } else {
        this.totalEgreso += item.monto;
        this.egreso++;
      }
    }
    this.doughnutChartData = [ [this.totalIngreso, this.totalEgreso ] ];
  }

}
