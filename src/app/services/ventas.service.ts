import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ventas {
  fecha: string;
  detalle: any;
  estado?: any;
  total?:any,
  costo?:any,
  id?: any;
  itemsVendidos: ItemsVendidos[];
}

export interface ItemsVendidos {
  idProducto: any;
  nombreProducto: any;
  marcaProducto: any;
  precioDeCompraAlMomentoDeVenta: any;
  cantidad: any;
  aplicaDescuento: any;
  precioUnitarioProducto:any;
  valorDeVenta: any;
  valorDeCosto?: any;
  data:any;
  escala?:any;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private itemsCollection: AngularFirestoreCollection<Ventas>;
  private itemDoc!: AngularFirestoreDocument<Ventas>;
  items: Observable<Ventas[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Ventas>('ventas', (ref) =>
      ref.orderBy('fecha', 'desc')
    );
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as Ventas;
          let id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
  listItem() {
    return this.items;
  }

  addItem(data: Ventas) {
    let id = data.id;
    // Persist a document
    if (!id) {
      id = this.afs.createId();
      data.id = id;
    }

    let item: Ventas = { id, ...data };
    this.itemsCollection.doc(id).set(item);
  }

  deleteItem(item: any) {
    this.itemDoc = this.afs.doc<Ventas>(`ventas/${item.id}`);
    this.itemDoc.delete();
  }


  deleteCollection() {
    let db = this.afs;
    console.log(db.collection('ventas'));

   /*  collectionRef.where("doc.id", "==", doc.id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete().then(() => {
          console.log("Documento eliminado con éxito!");
        }).catch(function(error) {
          console.error("Error eliminando documento: ", error);
        });
      });
    })
    .catch(function(error) {
      console.log("Error Obteniendo Documentos: ", error);
    }); */
  }


}
