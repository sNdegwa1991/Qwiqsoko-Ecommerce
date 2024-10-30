import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent {
  amountDue: any;
  payAmount: any;
  userId = localStorage.getItem('uid');
  orderNumber: any;
  contactNumber: any
  userDeatils: any;
  stkUp = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {orderNumber: any,amount: any}, private userService: UserService,
  private toast: ToastrService,private orderService: OrderService, private matDialog: MatDialog){
    this.amountDue = data.amount;
    this.orderNumber = data.orderNumber;

    this.payAmount = this.amountDue;
  }

  ngOnInit(){
   this.getUserDetails();
   }

   getUserDetails(){
    this.userService.getUserById(this.userId).subscribe((res:any) =>{
      this.userDeatils = res;
      this.contactNumber = this.userDeatils[0].phone;
    })
   }

   payNow(){
    var toPay = document.getElementById('payAmount') as HTMLInputElement
    var phone = document.getElementById('contactNumber') as HTMLInputElement
    
    if(toPay.value === "" || toPay.value === null || phone.value === "" || phone.value === null){
      this.toast.error("All fields are mandatory","Missing Records")
    } else {
      this.orderService.payOrder(phone.value,toPay.value,this.orderNumber,this.userId,"Order Payment",this.amountDue).subscribe((res:any)=>{
        if(res.status === "success"){
           this.stkUp = true;
        } else {
          this.toast.error("Check the number you entered. Only Safaricom number registered with Mpesa is accepted.","Wrong Number!")
        }
      })
    }

   }

   transcationCompleted(){
    this.stkUp = false;
     this.matDialog.closeAll();

   }

}
