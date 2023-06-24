import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  
  cartDetails = [];
  
  displayedColumns: string[] = ['Product Name', 'description', 'Product Actual Price', 'Product Discounted Price'];
  

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getCartDetails();
  }

  getCartDetails(){
    this.productService.getCartDetails().subscribe(
      (Response: any[]) => {
        console.log(Response);
        this.cartDetails = Response;
      }, (error) => {
        console.log(error);
      }
    );
  }

}
