import { ApiService, Products } from './../../services/api.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {

  
  @Output() btnSiguiente = new EventEmitter<Products>();
  @Output() btnRegresar = new EventEmitter<any>();

  @Input() accionPorRealizar!: string;

  _dataProductEdit!: Products;
  get dataProduct(): Products {
    return this._dataProductEdit;
  }
  @Input() set dataProduct(dataProductEdit: Products) {
    if (this.accionPorRealizar != 'agregar') {
      this._dataProductEdit = dataProductEdit;
      // this.productForm.get('name').setValue(dataProductEdit?.name);
      this.productForm.controls['name'].setValue(this._dataProductEdit?.name);
      this.productForm.controls['id'].setValue(this._dataProductEdit?.id);
      this.productForm.controls['brand'].setValue(this._dataProductEdit?.brand);
      this.productForm.controls['codeBar'].setValue(
        this._dataProductEdit?.codeBar
      );
      this.productForm.controls['priceStore'].setValue(
        this._dataProductEdit?.priceStore
      );
      this.productForm.controls['state'].setValue(this._dataProductEdit?.state);
      this.productForm.controls['stock'].setValue(this._dataProductEdit?.stock);
      this.productForm.controls['unitLength'].setValue(
        this._dataProductEdit?.unitLength
      );

       if(this.accionPorRealizar!='compra'){
        this.productForm.controls['cantidadNuevaCompra'].disable();
        this.productForm.controls['precioUniNuevaCompra'].disable();
      } 

      this.dataStocksPrice = this._dataProductEdit?.stockPrice;
    }
  }

  stockPrice: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    no: new FormControl('', [Validators.required]),
    priceSales: new FormControl('', [Validators.required]),
  });

  productForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    codeBar: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    priceStore: new FormControl('', [Validators.required]),
    unitLength: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    cantidadNuevaCompra: new FormControl('' ),
    precioUniNuevaCompra: new FormControl(''),
  });

  itemUpdate: number = -1;
  dataStocksPrice: StockPrice[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {}

  submit() {
    if (this.productForm.valid) {
      if (this.dataStocksPrice.length >= 0) {
        let data: Products = {
          ...this.productForm.value,
          stockPrice: this.dataStocksPrice,
        };
        // this.add(data);
        this.btnSiguiente.emit(data);
        this.regresar();
      }
    }
  }

  regresar() {
 
    this.productForm.reset();
    this.dataStocksPrice = [];
    this.btnRegresar.emit('close');
  }

  submitPrices() {
    if (this.stockPrice.valid) {
      if (this.itemUpdate == -1) {
        this.dataStocksPrice.push(this.stockPrice.value);
      } else {
        this.dataStocksPrice[this.itemUpdate] = this.stockPrice.value;
      }
      this.cancelPrice();
    }
  }

  updatePrice(data: StockPrice, i: number) {
    this.itemUpdate = i;
    this.stockPrice.setValue(data);
  }

  cancelPrice() {
    this.stockPrice.reset();
    this.itemUpdate = -1;
  }

  deletePrice(i: number) {
    this.dataStocksPrice.splice(i, 1);
    this.cancelPrice();
  }
}

export interface StockPrice {
  id?: string;
  name: string;
  no: number;
  priceSales: number;
}
