import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit{
  
  showMsg:boolean = false;

  isSingleProductCheckout: string = '';
  productDetails: Product[] = [];

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId: '',
    orderProductQuantityList: []
  }
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private injector: Injector){ }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");

    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        {productId: x.productId, quantity: 1}
      )
    );

    console.log(this.productDetails);
    console.log(this.orderDetails);
  }


  public placeOrder(orderForm: NgForm){
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();

        const ngZone = this.injector.get(NgZone);
        ngZone.run(
          () => {
            // this.router.navigate(["/orderConfirm"]);
            this.showMsg = true;
          }
        );
       
      },
      (err) => {
        console.log(err);
      }
    );
  }


  getQuantityForProduct(productId){
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId, productDiscountedPrice){
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity * productDiscountedPrice;
  }


  onQuantityChanged(q, productId){
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = q;
  }

  getCalculatedGrandTotal(){
    let grandTotal = 0;

    this.orderDetails.orderProductQuantityList.forEach(
      (productQunatity) => {
        const price = this.productDetails.filter(product => product.productId === productQunatity.productId)[0].productDiscountedPrice;
        grandTotal = grandTotal + price * productQunatity.quantity;
      }
    );

    return grandTotal;
  }

  createTransactionAndPlacedOrder(orderForm: NgForm){
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (response) => {
        console.log(response); 
        this.openTransactionModal(response, orderForm);       
      },
      (error) => {
        console.log(error);
        
      }
    );
  }

  openTransactionModal(response: any, orderForm: NgForm){
    var options = {
      order_id: response.order_id,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Doing INtegration Razorpay Test',
      description: 'Payment of Online Shopping',
      image: 'https://cdn.pixabay.com/photo/2023/07/24/01/31/plane-8145957_1280.jpg',
      handler: (response :any) => {
        if( response!=null && response.razorpay_payment_id != null){
          this.processResponse(response,orderForm);
        }else{
          alert("Payment failed...");
        }
      },
      prefill : {
        name: 'LPY',
        email: 'LPY@GMAIL.COM',
        contact: '90909090'
      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any, orderForm: NgForm) {
    // console.log(resp);
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
    
  }
}
