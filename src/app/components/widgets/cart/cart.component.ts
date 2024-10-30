import { Component } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartData!: CartModelServer;
  cartTotal!: number;
  subTotal!: number;
  serverURL2 = environment.IMG_URL;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    console.log(this.cartData)
  }

  // tslint:disable-next-line:typedef
  ChangeQuantity(index: number, increase: boolean){
    this.cartService.updatecartItems(index, increase);
  }
}
