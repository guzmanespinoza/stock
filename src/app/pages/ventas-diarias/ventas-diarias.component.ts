import { Component, OnInit } from '@angular/core';
import { ApiService, Products } from 'src/app/services/api.service';
import { Finanzas, FinanzasService } from 'src/app/services/finanzas.service';
import {
  ItemsVendidos,
  Ventas,
  VentasService,
} from 'src/app/services/ventas.service';

@Component({
  selector: 'app-ventas-diarias',
  templateUrl: './ventas-diarias.component.html',
  styleUrls: ['./ventas-diarias.component.scss'],
})
export class VentasDiariasComponent implements OnInit {
  pantalla: string = 'listaDeVentasDiarias';
  filterQuery: string = '';
  products: Products[] = [];
  totalVentaSeleccionada: number = 0;
  totalCostoSeleccionada: number = 0;

  total = 0;
  costo = 0;

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
    total: 0,
    costo: 0,
    itemsVendidos: [],
    estado: 'Facturado',
  };

  listaventas: Ventas[] = [];
  ventaSeleccionada: Ventas = {
    id: '',
    detalle: '',
    fecha: '',
    itemsVendidos: [],
  };

  dataProduct!: Products;

  constructor(
    private api: ApiService,
    private financeApi: FinanzasService,
    private ventasApi: VentasService
  ) {
    this.api.listItem().subscribe((items) => {
      this.products = items;
      console.log(items);
    });
    this.ventasApi.listItem().subscribe((items) => {
      this.listaventas = items;

      // this.listaventas[0]=this.ventaSeleccionada;

      this.total = this.listaventas.reduce(
        (sum, value) =>
          typeof value.total == 'number' ? sum + value.total : sum,
        0
      );

      this.costo = this.listaventas.reduce(
        (sum, value) =>
          typeof value.costo == 'number' ? sum + value.costo  : sum,
        0
      );

      console.log('this.costo', this.costo);
  
      for(let d of this.listaventas){

       console.log(d.id, d.costo);
       }
      
     

      

      console.log(items);
    });
  }

  ngOnInit(): void {}

  clickEnBotonNuevaVenta() {
    this.pantalla = 'nuevaVenta';
    this.venta = {
      detalle: 'Consumidor Final',
      fecha: new Date().toString(),
      itemsVendidos: [],
      estado: 'Facturado',
      total: 0,
      costo: 0,
    };

    this.totalVentaSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeVenta == 'number' ? sum + value.valorDeVenta : sum,
      0
    );

    this.totalCostoSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeCosto == 'number' ? sum + value.valorDeCosto : sum,
      0
    );
  }

  selectProduct(prod: Products) {
    this.dataProduct = prod;
    this.pantalla = 'detallePorductoSeleccionadoVenta';
  }

  registrarVenta() {
    this.venta.total = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeVenta == 'number' ? sum + value.valorDeVenta : sum,
      0
    );

    this.venta.costo = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeCosto == 'number' ? sum + value.valorDeCosto : sum,
      0
    );

    this.ventasApi.addItem(this.venta);
    this.pantalla = 'listaDeVentasDiarias';
  }

  removerCompra(d: any) {
    let position = this.venta.itemsVendidos.indexOf(d);
    if (position !== -1) {
      this.venta.itemsVendidos.splice(position, 1);
    }
    this.totalVentaSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeVenta == 'number' ? sum + value.valorDeVenta : sum,
      0
    );

    this.totalCostoSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeCosto == 'number' ? sum + value.valorDeCosto : sum,
      0
    );
  }

  totalVentaSeleccionadaVendida = 0;

  seleccionarVenta(venta: Ventas) {
    this.ventaSeleccionada = venta;

    this.totalVentaSeleccionadaVendida =
      this.ventaSeleccionada.itemsVendidos.reduce(
        (sum, value) =>
          typeof value.valorDeVenta == 'number'
            ? sum + value.valorDeVenta
            : sum,
        0
      );

    this.pantalla = 'ventaSeleccionada';
  }

  agregarItem() {
    this.itemPrevendido.data = this.dataProduct;
    this.itemPrevendido.precioDeCompraAlMomentoDeVenta =
      this.dataProduct.priceStore;

    let unidadesVendidas = this.itemPrevendido.data.stockPrice.find(
      (item: { priceSales: any }) =>
        item.priceSales == this.itemPrevendido.precioUnitarioProducto
    ).no;

    this.itemPrevendido.cantidad =
      this.itemPrevendido.cantidad * unidadesVendidas;

    if (this.itemPrevendido.aplicaDescuento == false) {
      this.itemPrevendido.precioUnitarioProducto =
        this.itemPrevendido.precioUnitarioProducto / unidadesVendidas;
      this.itemPrevendido.valorDeVenta =
        this.itemPrevendido.cantidad *
        this.itemPrevendido.precioUnitarioProducto;
    } else {
      this.itemPrevendido.precioUnitarioProducto =
        this.itemPrevendido.valorDeVenta / this.itemPrevendido.cantidad;
    }

    console.log(this.itemPrevendido);
    this.itemPrevendido.idProducto = this.dataProduct.id;
    this.itemPrevendido.marcaProducto = this.dataProduct.brand;
    this.itemPrevendido.nombreProducto = this.dataProduct.name;
    this.itemPrevendido.valorDeCosto =
      this.itemPrevendido.cantidad *
      this.itemPrevendido.precioDeCompraAlMomentoDeVenta;

    console.log('unidadesVendidas', unidadesVendidas);

    console.log(this.itemPrevendido);

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

    this.totalVentaSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeVenta == 'number' ? sum + value.valorDeVenta : sum,
      0
    );

    this.totalCostoSeleccionada = this.venta.itemsVendidos.reduce(
      (sum, value) =>
        typeof value.valorDeCosto == 'number' ? sum + value.valorDeCosto : sum,
      0
    );

    this.pantalla = 'nuevaVenta';
  }

  clave: string = '';

  facturar() {
    if (this.clave == '123456') {
      let costo = this.listaventas.reduce(
        (sum, value) =>
          typeof value.costo == 'number' ? sum + value.costo : sum,
        0
      );

      let venta = this.listaventas.reduce(
        (sum, value) =>
          typeof value.total == 'number' ? sum + value.total : sum,
        0
      );

      let costoCierre: Finanzas = {
        detalle: 'CIERRE DE VENTAS (COSTOS)',
        fecha: new Date().toString(),
        monto: costo,
        data: this.listaventas,
        tipo: 'costo',
      };

      this.financeApi.addItem(costoCierre);

      let utilidadCierre: Finanzas = {
        detalle: 'CIERRE DE VENTAS (UTILIDAD)',
        fecha: new Date().toString(),
        monto: venta - costo,
        data: null,
        tipo: 'utilidad',
      };

      this.financeApi.addItem(utilidadCierre);

      for (let v of this.listaventas) {
        this.ventasApi.deleteItem(v);
      }
    }
  }
}
