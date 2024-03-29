import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css']
})
export class ProductViewDetailsComponent implements OnInit {

  showMsg: boolean = false;

  selectedProductIndex = 0;

  product: Product;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];
  }

  addToCart(productId){
    // console.log(productId);
    this.productService.addToCart(productId).subscribe(
      (response) => {
        console.log(response);
        this.showMsg = true;
      }, (error) => {
        console.log(error);
      }
    );
  }

  changeIndex(index) {
    this.selectedProductIndex = index;
  }

  buyProduct(productId){
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: true, id: productId
    }]);
  }

}
