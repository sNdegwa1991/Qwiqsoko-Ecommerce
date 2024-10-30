import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent {
  message: any;
  orderId = localStorage.getItem('order');
  products: any;
  cartTotal: any;
  productsOrders: any;
  viewOrders: any;
  myDate: any
  serverURL2 = environment.IMG_URL;
  cartData: any;
  deliveryFees = localStorage.getItem('fees');


  constructor(public cartService: CartService,private router: Router){
    this.cartData = JSON.parse(localStorage.getItem('OrderedCart') || '{}');
    this.viewOrders = this.cartData.data;
    //this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.cartTotal=Number(this.cartData.total)+Number(this.deliveryFees);
   
  }

  ngOnInit(): void {
    console.log(this.cartData)
  }

  goToProfile(): void {
    this.router.navigate(['/profile'])
  }

}
