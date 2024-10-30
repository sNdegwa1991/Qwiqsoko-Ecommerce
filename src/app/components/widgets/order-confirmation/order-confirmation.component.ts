import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { SharedServiceService } from 'src/app/services/general/shared-service.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent {
  cartData!: CartModelServer;
  cartTotal!: number;
  subTotal!: number;
  serverURL2 = environment.IMG_URL;

  coordinates: any;
   areaName: any;
   distance: any
   receiveMode: any;
   drop: any
   contactNumber: any;
   restaurant: any;
   deliveryFees: any;
   deliveryData: any;
   Number: any;
   timeline: any;
   notes = '';
   cart: any;
   cartDetails: any[] = [];
   userid = localStorage.getItem('uid');
   userPhone: any;
   actualTime: any;

  constructor(public cartService: CartService,private activateRoute: ActivatedRoute,
    private sharedService: SharedServiceService,private orderService: OrderService,
    private userService: UserService,private router: Router,private toast: ToastrService) {
      this.activateRoute.queryParams.subscribe((params: any) =>{
        this.coordinates = this.sharedService.decryptData(params.coods);
        this.areaName = this.sharedService.decryptData(params.mapDrop);
        this.distance = this.sharedService.decryptData(params.distance);
        this.receiveMode = this.sharedService.decryptData(params.mode);
        this.drop = this.sharedService.decryptData(params.drop);
        this.contactNumber = this.sharedService.decryptData(params.contactNumber);
        this.restaurant = this.sharedService.decryptData(params.source);
        this.timeline = this.sharedService.decryptData(params.timeline);
        this.actualTime = this.sharedService.decryptData(params.actualTime);
      })
      this.getUserDetails();
      this.calculateDeliveryFee();
      this.cart = this.cartService.getCart();
     }
  
  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }
  getUserDetails(){
    this.userService.getUserById(this.userid).subscribe(user =>{
      this.userPhone = user[0].phone;
    })
  }

  // tslint:disable-next-line:typedef
  ChangeQuantity(index: number, increase: boolean){
    this.cartService.updatecartItems(index, increase);
  }

  calculateDeliveryFee(){
    this.sharedService.getSpecificDeliveryStats(this.timeline,this.distance).subscribe((res:any) =>{
      this.deliveryData = res.dels
      this.deliveryFees = this.deliveryData[0].fees;
      localStorage.setItem('fees',this.deliveryFees);
    })
  }

  place_order(){
    let ls = JSON.parse(localStorage.getItem('restoId') || '{}');
   
    const orderId = Math.floor(Math.random() * 99999) + 10000;
    let userName = localStorage.getItem('user');

    const catLeng = this.cartData.data.length;
    
    
    let when = this.timeline;
    let expectation = 'Schedule';

    if(when == 2){
       expectation = 'Normal'
    }
    if(when == 1){
      expectation = 'Urgently'
    }
   
    let speficTime = 'Soonest'
    if(when == 3){
     //----------------------------get the time set.
     speficTime = this.actualTime;
    }
   
  
    const resto_id = ls[0];
    
    const message = 'Your order number '+orderId+' has been received. Kindly wait for it to be reviewed.';
    const messageAdmin = 'Order Alert! '+expectation+' Order number '+orderId+' has been placed by '+userName+'. Open the App to view the details. From Web';
    this.orderService.registerOder(this.userid,orderId,this.coordinates,this.areaName,this.drop,'.',this.deliveryFees,this.timeline,resto_id,this.contactNumber,this.receiveMode,this.notes,expectation,speficTime).subscribe((res) =>{
      for(var increment=0;increment<catLeng;increment++)
      {
        const product = this.cartData.data[increment].product.id
        const quantity = this.cartData.data[increment].numInCart;
        const price = this.cartData.data[increment].product.price;
      
      this.orderService.registerOrderDetails(orderId,product,quantity,price).subscribe((result) =>{
         
       })
     }
    
   });
   //.............................................successfull
   localStorage.setItem("order",orderId.toString())
   this.toast.success(orderId+' Placed Successful', 'Success', {
    timeOut: 1500,
    progressBar: true,
    progressAnimation: 'increasing',
    positionClass: 'toast-top-right'
  });
   this.sharedService.sendTextSms(message,this.userPhone).subscribe(res =>{});
   this.sharedService.sendTextSms(messageAdmin,environment.textPhone).subscribe(res =>{});
   setTimeout (() => {
    this.router.navigate(['/thankyou'])
    this.cartService.clearCart();
   }, 2000);
   
  }

  reviewOrder(){
    this.router.navigate(['/cart'])
  }
}
