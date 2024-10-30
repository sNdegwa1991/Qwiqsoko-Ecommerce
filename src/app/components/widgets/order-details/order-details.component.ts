import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { OrderPaymentComponent } from '../order-payment/order-payment.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  orderStatus: any;
  aprovalStatus: any;
  orderId: any;
  orderDetails: any;
  otherCost: any;
  loc: any;
  building: any;
  info: any;
  deliveryDate: any;
  deliveryFees: any;
  orderDetailsReviewed: any;
  otherCosts: any;
  otherCostsTotal = 0;
  otherLen = 0;
  riderName: any;
  riderPhone: any;
  review: any;
  orderPayments: any[]= [];
  orderCost: any;
  amountDue: any;
  date_placed: any;
  time_frame: any;
  amount_paid: any;

  docLink: any;
  proposedItems: any;
  proposeLength: any;
  imageURL = environment.SERVER_URL+'/images/foods';
  receiptUrl = environment.SERVER_URL+'/pdf/receipts';
  receipt_img: any;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private orderService: OrderService,
    private prodService: ProductService){
      this.route.params.subscribe(data => {
        this.orderId = data['orderId'];
      });

    }

    ngOnInit(){
     this.populateData();
    }

    openPaymentModal(){
      let balance = (this.amountDue+this.otherCostsTotal)-this.amount_paid;
      const dialogRef = this.matDialog.open(OrderPaymentComponent , {
        data: {orderNumber: this.orderId,amount: balance}
       });
    }

    populateData(){
      this.orderService.getOrderDetails(this.orderId).subscribe((res:any) =>{
        this.orderDetails = res.products;
        console.log(this.orderDetails)
      });
  
      this.orderService.getReviewedOrderDetails(this.orderId).subscribe(res =>{
        this.orderDetailsReviewed = res;

      });
      // this.payementsService.getOrderPayments(this.orderNumber).subscribe((res:any) =>{
      //   this.orderPayments = res.payments;
      // })
  
      this.orderService.getOrderStatus(this.orderId).subscribe((data) =>{
        this.orderStatus = data;
         
       console.log(data)
        this.aprovalStatus = this.orderStatus.orders[0].status;
        this.review = this.orderStatus.orders[0].review;
        this.loc = this.orderStatus.orders[0].address;
        this.building = this.orderStatus.orders[0].building;
        this.info = this.orderStatus.orders[0].information;
        this.riderName = this.orderStatus.orders[0].rider_name;
        this.riderPhone = this.orderStatus.orders[0].rider_phone;
        this.deliveryDate = this.orderStatus.orders[0].date_served;
        this.deliveryFees = Number(this.orderStatus.orders[0].delivery_fees);
        this.receipt_img = this.orderStatus.orders[0].receipt;
       this.orderCost = this.orderStatus.orders[0].orderCost;
       this.amountDue = this.orderStatus.orders[0].amount_due;
       this.date_placed = this.orderStatus.orders[0].date_placed;
       this.time_frame = this.orderStatus.orders[0].time_frame;
       this.amount_paid = this.orderStatus.orders[0].paid;
       
       })
  
       this.orderService.getOtherOrderCosts(this.orderId).subscribe((res: any) =>{
        this.otherCosts = res.costs;
        let len = this.otherCosts.length;
        this.otherLen = len;
        let costs = 0;
        for(let i=0;i<len;i++){
         costs = costs+Number(this.otherCosts[i].amount);
        }
        this.otherCostsTotal = costs;
       })
       this.prodService.getReviewProposal(this.orderId).subscribe((res:any) =>{
        this.proposedItems = res.products;
        this.proposeLength = this.proposedItems.length;
       })
    }
  

}
