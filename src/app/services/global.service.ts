import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // user jo product ko select kara ga uska data yahn store ho ga 
  private selectedProduct = new BehaviorSubject<any>(null);
  selectedProduct$ = this.selectedProduct.asObservable();

  constructor() { }

  // Product ko store karne k liye function

  setSelectedProduct(product: any) {
    this.selectedProduct.next(product);
  }

    // Product ko get karne k liye function
    getSelectedProduct() {
      return this.selectedProduct.getValue();
    }

}
