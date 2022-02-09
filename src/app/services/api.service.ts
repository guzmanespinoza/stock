
import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Products {
  id?: string;
  codeBar?: string;
  name: string;
  brand: string;
  stock: any;
  stockPrice:StockPrice[];
  priceStore:any;
  unitLength:string;
  state:string;
  cantidadNuevaCompra?:any;
  precioUniNuevaCompra?:any;
}

export interface StockPrice {
  id?: string;
  name: string;
  no:number;
  priceSales:number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private itemsCollection: AngularFirestoreCollection<Products>;
  private itemDoc!: AngularFirestoreDocument<Products>;
  items: Observable<Products[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Products>(
      'products',
      (ref) => ref.orderBy('name', 'asc') /*.startAt('A').endAt('z')*/
    );
    // this.items = this.itemsCollection.valueChanges();
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as Products;
          let id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  listItem() {
    return this.items;
  }

  addItem(data:Products) {
    let id =data.id;
    // Persist a document
    if(!id){
      id= this.afs.createId();
      data.id=id;
    }

    for(let d of data.stockPrice){
      d.id=id;
    }

    let item: Products = { id, ...data };
    this.itemsCollection.doc(id).set(item);
  }

  deleteItem(item: any) {
    this.itemDoc = this.afs.doc<Products>(`products/${item.id}`);
    this.itemDoc.delete();
  }
}
