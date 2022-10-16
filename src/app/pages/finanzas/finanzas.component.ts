import { Component, OnInit } from '@angular/core';
import { Finanzas, FinanzasService } from 'src/app/services/finanzas.service';

declare var $: any;

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.scss'],
})
export class FinanzasComponent implements OnInit {
  finanzas: Finanzas[] = [];
  filterQuery: string = '';
  clave: string = '';

  dataNuevoFinanzas: Finanzas = {
    detalle: '',
    fecha: new Date().toString(),
    monto: '',
    data: null,
    tipo: '',
  };

  total = 0;

  opt: string = 'none'; //none-add-edit
  accionPorRealizar: string = 'agregar';

  constructor(private financeApi: FinanzasService) {
    this.financeApi.listItem().subscribe((items) => {
      this.finanzas = items;
      console.log('finanzas',items);

      this.total = this.finanzas.reduce(
        (sum, value) =>
          typeof value.monto == 'number' ? sum + value.monto : sum,
        0
      );
    });
  }

  ngOnInit(): void {}

  agregarFinanza() {

    if(this.dataNuevoFinanzas.tipo=='egreso'){
      this.dataNuevoFinanzas.monto=- this.dataNuevoFinanzas.monto;
    }

    this.financeApi.addItem(this.dataNuevoFinanzas);

    this.dataNuevoFinanzas = {
      detalle: '',
      fecha: new Date().toString(),
      monto: '',
      data: null,
      tipo: '',
    };

    this.total = this.finanzas.reduce(
      (sum, value) =>
        typeof value.monto == 'number' ? sum + value.monto : sum,
      0
    );

    $('.modal').modal('hide');
  }
}
