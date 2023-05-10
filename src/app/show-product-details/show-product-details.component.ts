import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {

  productDetails: Product[] = [];
  displayedColumns: string[] = ['ID', 'Product Name', 'Product Description', 'Product Actual Price', 'Product Discounted Price'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (resp: Product[]) => {
        console.log(resp);
        this.productDetails = resp;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

}
