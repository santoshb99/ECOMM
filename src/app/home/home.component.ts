import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { Product } from '../_model/product.model';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  pageNumber: number = 0;
  productDetails = [];
  showMoreButton = false;

  constructor(private productService: ProductService, 
    private imageProcessingService: ImageProcessingService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.getAllProducts();
  }


  searchByKeyword(searchkeyword){
    // console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
    .pipe(
      map((x: Product[], i) => x.map((product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        console.log(resp);
        if (resp.length==10) {
          this.showMoreButton=true;
        }else{
          this.showMoreButton=false;
        }
        resp.forEach(p => this.productDetails.push(p));
        // this.productDetails = resp;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  public loadMoreProduct(){
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  showProductDetails(productId){
    this.router.navigate(['/productViewDetails', {productId: productId}]);
  }

}
