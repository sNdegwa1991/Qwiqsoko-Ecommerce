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
userId = localStorage.getItem('uid');
user = localStorage.getItem('user');
auth = localStorage.getItem('soko-token');
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
      console.log(this.userOrders)
    })

  }

  logout(): void {
    this.userService.logout();
  }

}
