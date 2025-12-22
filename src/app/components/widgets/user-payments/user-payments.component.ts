import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.scss']
})
export class UserPaymentsComponent {

  myUser: any;
  details:any;
  email: any;
  userOrders: any;
  userPayemnts: any;
  userId = localStorage.getItem('uid');
  user = localStorage.getItem('user');
  auth = localStorage.getItem('soko-token');

  isMenuOpen = false;
  searchText: string = '';
    constructor(private userService: UserService,
      private router: Router, private orderService: OrderService) {
        if(this.auth === '' || this.auth === null)
        {
          router.navigate(['/login'])
        }
       }
  
    ngOnInit(): void {
      this.getUserPayments()
    }

    getUserPayments(){
      this.orderService.getUserPayments(this.userId).subscribe((res:any)=>{
        this.userPayemnts = res.payments
      })
    }
  
    logout(): void {
      this.isMenuOpen = false;
      this.userService.logout();;
    }

     toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuOnMobile() {
    if (window.innerWidth < 992) {
      this.isMenuOpen = false;
    }
  }

  filterPayments() {
    // Implement your search/filter logic here
  }

  getTotalPaid(): number {
    if (!this.userPayemnts || this.userPayemnts.length === 0) return 0;
    return this.userPayemnts.reduce((sum:any, payment:any) => sum + parseFloat(payment.amount), 0);
  }

  getRecentPaymentAmount(): number {
    if (!this.userPayemnts || this.userPayemnts.length === 0) return 0;
    return parseFloat(this.userPayemnts[0]?.amount) || 0;
  }

}
