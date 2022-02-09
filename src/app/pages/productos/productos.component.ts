import { ApiService, Products } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Finanzas, FinanzasService } from 'src/app/services/finanzas.service';
declare var $: any;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  products: Products[] = [];
  filterQuery: string = '';
  modalTitle: string = '';
  opt: string = 'none'; //none-add-edit
  accionPorRealizar: string = 'agregar';

  dataProduct!: Products;

  constructor(private api: ApiService, private financeApi: FinanzasService) {
    this.api.listItem().subscribe((items) => {
      this.products = items;
      console.log(items);
    });
  }

  ngOnInit() {
  
  }

  deleteProduct(p: Products) {
    this.api.deleteItem(p);
  }

  btnSiguiente(d: Products) {
    console.log(d);
    if (this.accionPorRealizar == 'compra') {
      let totalExiActual =
        parseFloat(d.cantidadNuevaCompra) + parseFloat(d.stock);
      let costoExiAnterior = parseFloat(d.priceStore) * parseFloat(d.stock);
      let costoExiActual =
        parseFloat(d.cantidadNuevaCompra) * parseFloat(d.precioUniNuevaCompra);

      d.priceStore = (costoExiAnterior + costoExiActual) / totalExiActual;
      d.stock = totalExiActual;

      let modelFi: Finanzas = {
        detalle: 'COMPRA DE PRODUCTO PARA LA VENTA',
        fecha:  new Date().toString(),
        monto: -costoExiActual,
        data: null,
        tipo: 'compra',
      };

      this.financeApi.addItem(modelFi);
    }

    delete d.cantidadNuevaCompra;
    delete d.precioUniNuevaCompra;

    this.api.addItem(d);
    this.btnCancelar();
  }

  btnCancelar(d?: any) {
    this.accionPorRealizar = 'close';
    $('.modal').modal('hide');
  }

  openModal(title: string) {
    this.accionPorRealizar = 'agregar';
    this.modalTitle = title;
    $('.modal').modal('show');
  }

  selectProduct(prod: Products) {
    this.dataProduct = prod;
    this.accionPorRealizar = 'editar';
    this.modalTitle = 'Editar producto';
    $('.modal').modal('show');
  }

  selectProductForCompra(prod: Products) {
    this.dataProduct = prod;
    this.accionPorRealizar = 'compra';
    this.modalTitle = 'Compra de producto';
    $('.modal').modal('show');
  }


}
