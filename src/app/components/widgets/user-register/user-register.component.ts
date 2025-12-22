import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent {
  email: any
  password: any
  password1: any
  phone: any
  name: any

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  private toast: ToastrService) { }

  ngOnInit(): void {
   
  }


  register(form: NgForm): void {
    const email: string = this.email
    const password: string = this.password
    const password1: string = this.password1
    const phone: string = this.phone
    const name: string = this.name

    if(password == password1){
      this.userService.registerData(email, name,password,phone).subscribe(res =>{
        console.log(res)
      })

    } else {
    this.toast.error('The confirmation password do not match the initial password', 'Error', {
    timeOut: 3000,
    progressBar: true,
    progressAnimation: 'increasing',
    positionClass: 'toast-top-right'
  });
    }
} 

}
