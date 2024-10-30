import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmailService } from '../email/email.service';
import { Router } from '@angular/router';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class UserService {
  //userHolder = { token: '',auth: false,email: '',username: '',fname: '',lname: '',photoUrl: '',userId: 0,message: '',status: 0};
  auth: boolean = false
 // private  SERVER_URL: string = environment.SERVER_URL;
  private  SERVER_URL: string = environment.SERVER_URL;
  //private user;
  authState$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userData$ : BehaviorSubject<any> = new BehaviorSubject<any>(undefined!);
  user: any

  constructor(private http: HttpClient, private toast: ToastrService, 
            private email: EmailService,
            private router: Router) {}


   logout(): void{
        this.auth = false;
        localStorage.removeItem('soko-token')
        localStorage.removeItem('email')
        localStorage.removeItem('user')
        localStorage.removeItem('uid')

        this.router.navigate(['./']);
    } 

  loginUser(email: string, password: string): void {
      this.http.post(`${this.SERVER_URL}/login.php`, {email, password})
      .subscribe((data: any) => {
        this.auth = data.auth;
        this.authState$.next(this.auth);
        this.userData$.next(data);
        localStorage.setItem('token',data.token);
        localStorage.setItem('email',data.email);
        localStorage.setItem('user',data.fname+' '+data.lname);
        localStorage.setItem('uid',data.userid);
      });
  }
  
  loginData(email:string, password: string) {
    return this.http.get(`${this.SERVER_URL}/login.php?email=${email}&password=${password}`).subscribe((data:any) => {
      this.user = data;
      if(data === 'Failed'){
        alert('Invalid Credentials')
       } else {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(data);
        localStorage.setItem('soko-token',data[0].auth_code);
        localStorage.setItem('email',data[0].email);
        localStorage.setItem('user',data[0].name);
        localStorage.setItem('uid',data[0].userid);
        localStorage.setItem('soko-auth','true');
        if(this.user[0].auth_code === '1')
        {
          this.router.navigate(['/profile']);

        } else {
           this.router.navigate(['/activation']);
        }
       }
    })
  }

  getUserById(userId: any) {
    return this.http.get<any>(this.SERVER_URL + '/getUserById.php?userId=' + userId);
  }
}


export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  message: string;
  status: number;

}
