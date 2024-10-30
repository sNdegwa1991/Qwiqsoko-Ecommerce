import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
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

      this.getUserDeatils();
     }

  ngOnInit(): void {
    this.orderService.getUserOrders(this.userId).subscribe(orders =>{
      this.userOrders = orders.orders;
      //console.log(this.userOrders)
    })

  }

  getUserDeatils(){
    this.userService.getUserById(this.userId).subscribe((res:any) =>{
      this.myUser = res[0];
      console.log(this.myUser)
    })
  }

  logout(): void {
    this.userService.logout();
  }

}
