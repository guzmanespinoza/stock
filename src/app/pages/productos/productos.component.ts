import { ApiService, Products } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
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
  modoEdicion:boolean=false;

  dataProduct!: Products;

  constructor(private api: ApiService) {
    this.api.listItem().subscribe((items) => {
      this.products = items;
      console.log(items);
    });
  }

  ngOnInit() {}

  deleteProduct(p: Products) {
    this.api.deleteItem(p);
  }

  btnSiguiente(d: Products) {
    this.api.addItem(d);
    this.btnCancelar();
  }

  btnCancelar(d?:any){
    this.modoEdicion=false;
    $('.modal').modal('hide');
  }

  openModal(title:string) {
    this.modoEdicion=false;
    this.modalTitle=title;
    $('.modal').modal('show');
  }

  selectProduct(prod:Products){
    this.dataProduct=prod;
    this.modoEdicion=true;
    this.modalTitle='Editar producto';
    $('.modal').modal('show');
  }
}
