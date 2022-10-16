import { ApiService, Products } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Finanzas, FinanzasService } from 'src/app/services/finanzas.service';
import { ItemsVendidos, Ventas, VentasService } from 'src/app/services/ventas.service';
declare var $: any;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit {
  pantalla = 'listaVentas';

  products: Products[] = [];
  filterQuery: string = '';
  modalTitle: string = '';
  opt: string = 'none'; //none-add-edit
  accionPorRealizar: string = 'agregar';

  dataProduct!: Products;

  itemPrevendido: ItemsVendidos = {
    cantidad: '',
    idProducto: '',
    marcaProducto: '',
    nombreProducto: '',
    precioUnitarioProducto: '',
    precioDeCompraAlMomentoDeVenta: '',
    valorDeVenta: '',
    aplicaDescuento: false,
    data: {},
  };

  venta: Ventas = {
    detalle: 'Consumidor Final',
    fecha: new Date().toString(),
    itemsVendidos: [],
    estado: 'pendiente',
  };

  listaventas: Ventas[] = [];

  constructor(private api: ApiService, private financeApi: FinanzasService, private ventasApi:VentasService) {
    this.api.listItem().subscribe((items) => {
      this.products = items;
      console.log(items);
    });

    this.ventasApi.listItem().subscribe((items) => {
      this.listaventas = items;
      console.log(items);
    });
  }

  selectProduct(prod: Products) {
    this.dataProduct = prod;
    this.accionPorRealizar = 'editar';
    this.pantalla = 'vendiendo';
  }

  ngOnInit(): void {}

  agregarItem() {
    if (this.itemPrevendido.aplicaDescuento == false) {
      this.itemPrevendido.valorDeVenta =
        this.itemPrevendido.cantidad *
        this.itemPrevendido.precioUnitarioProducto;
    }

    this.itemPrevendido.idProducto = this.dataProduct.id;
    this.itemPrevendido.marcaProducto = this.dataProduct.brand;
    this.itemPrevendido.nombreProducto= this.dataProduct.name;
    this.itemPrevendido.precioDeCompraAlMomentoDeVenta =
      this.dataProduct.priceStore;
    this.itemPrevendido.data = this.dataProduct;

    this.venta.itemsVendidos.push(this.itemPrevendido);

    console.log(this.venta);

    this.itemPrevendido = {
      cantidad: '',
      idProducto: '',
      marcaProducto: '',
      nombreProducto: '',
      precioUnitarioProducto: '',
      precioDeCompraAlMomentoDeVenta: '',
      valorDeVenta: '',
      aplicaDescuento: false,
      data: {},
    };
    this.pantalla = 'nuevaVenta';
  }

  nuevaVenta() {
    this.pantalla = 'nuevaVenta';
    this.venta = {
      detalle: 'Consumidor Final',
      fecha: new Date().toString(),
      itemsVendidos: [],
      estado: 'pendiente',
    };
  }


  registrarVenta(){

    this.ventasApi.addItem(this.venta);

    this.pantalla = 'listaVentas';


  }


}
