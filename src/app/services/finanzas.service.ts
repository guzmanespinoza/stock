import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Finanzas{
  fecha:string;
  monto:any;
  detalle:any;
  data?:any;
  tipo?:any;
  id?:any;
}

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  private itemsCollection: AngularFirestoreCollection<Finanzas>;
  private itemDoc!: AngularFirestoreDocument<Finanzas>;
  items: Observable<Finanzas[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Finanzas>(
      'finances',
      (ref) => ref.orderBy('fecha', 'desc')
    );
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as Finanzas;
          let id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
  listItem() {
    return this.items;
  }

  addItem(data:Finanzas) {
    let id =data.id;
    // Persist a document
    if(!id){
      id= this.afs.createId();
      data.id=id;
    }

    let item: Finanzas = { id, ...data };
    this.itemsCollection.doc(id).set(item);
  }

  deleteItem(item: any) {
    this.itemDoc = this.afs.doc<Finanzas>(`Finanzas/${item.id}`);
    this.itemDoc.delete();
  }


}
