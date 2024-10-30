import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  authState!: boolean;

  constructor(private userService: UserService,private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => this.authState = authState);
  }
}
