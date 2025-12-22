import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  myUser: any;
details:any;
email: any;
userOrders: any;
supermarketShopping: any
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
    this.orderService.getUserOrders(this.userId).subscribe(orders =>{
      this.userOrders = orders.orders;
    })

    this.getShopping(this.userId)

  }

  logout(): void {
     this.isMenuOpen = false;
    this.userService.logout();
  }

   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuOnMobile() {
    if (window.innerWidth < 992) {
      this.isMenuOpen = false;
    }
  }


  filterOrders() {
    // Implement your search/filter logic here
  }

  getPendingCount(): number {
    return this.userOrders?.filter((o:any) => o.status === '0').length || 0;
  }

  getOnwayCount(): number {
    return this.userOrders?.filter((o:any) => o.status === '10').length || 0;
  }

  getDeliveredCount(): number {
    return this.userOrders?.filter((o:any) => o.status === '4').length || 0;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      '0': 'badge-pending',
      '1': 'badge-unpaid',
      '2': 'badge-paid',
      '3': 'badge-cancelled',
      '4': 'badge-delivered',
      '5': 'badge-reviewed',
      '10': 'badge-onway'
    };
    return statusMap[status] || 'badge-default';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      '0': 'Pending',
      '1': 'Unpaid',
      '2': 'Paid',
      '3': 'Cancelled',
      '4': 'Delivered',
      '5': 'Reviewed',
      '10': 'On the Way'
    };
    return statusMap[status] || 'Unknown';
  }

  getShopping(userid: any){
    this.orderService.getUserShoppingList(userid).subscribe((res:any) =>{
      this.supermarketShopping = res.orders
      console.log(this.supermarketShopping)
    })
  }
  

}
