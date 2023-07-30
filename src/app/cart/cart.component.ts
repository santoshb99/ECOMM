import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  
  cartDetails: any[] = [];
  
  displayedColumns: string[] = ['Name', 'Description', 'Price', 'Discounted Price', 'Action'];
  

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getCartDetails();
  }

  delete(cartId) {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        console.log(resp);
        this.getCartDetails();
      }, (err) => {
        console.log(err);
      }
    );
  }

  getCartDetails(){
    this.productService.getCartDetails().subscribe(
      (Response: any[]) => {
        console.log(Response);
        this.cartDetails = Response;
      }, (error) => {
        console.log(error);``
      }
    );
  }

  checkout(){
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: false, id: 0
    }]);

    // this.productService.getProductDetails(false, 0).subscribe(
    //   (resp) => {
    //     console.log(resp);
    //   }, (err) => {
    //     console.log(err);
    //   }
    // );
  }

}
