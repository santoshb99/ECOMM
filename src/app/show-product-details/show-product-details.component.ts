import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {

  pageNumber: number = 0;
  productDetails: Product[] = [];
  displayedColumns: string[] = ['ID', 'Product Name', 'description', 'Product Actual Price', 'Product Discounted Price','Actions'];
  showMoreProductButton = false;
  showTable = false;

  constructor(private productService: ProductService, 
    public imagesDialog: MatDialog, 
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

  public getAllProducts(searchKeyword: string = "") {
    this.showTable = false;
    this.productService.getAllProducts(this.pageNumber, searchKeyword)
    .pipe(
      map((x: Product[], i) => x.map((product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        // console.log(resp);
        resp.forEach(product => this.productDetails.push(product));
        this.showTable = true;
        // this.productDetails = resp;

        if(resp.length == 10){
          this.showMoreProductButton = true;
        } else {
          this.showMoreProductButton = false;
        }

      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  loadMoreProduct(){
    this.pageNumber = this.pageNumber+1;
    this.getAllProducts();
  }

  deleteProduct(productId){
    // console.log(productId);
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        // console.log(resp);
        this.getAllProducts();
      },
      (error:HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  showImages(product: Product){
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent, {
      data: {
        images: product.productImages
      },
      height: '500px',
      width: '800px'
    });
  }

  editProductDetails(productId){
    // console.log(productId);
    this.router.navigate(['/addNewProduct', {productId: productId}]);
  }



}
