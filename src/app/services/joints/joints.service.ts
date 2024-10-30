import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JointsService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  getJointDetails(jointId: any) {
    return this.http.get(this.SERVER_URL + '/get-restaurant-details.php?search=' + jointId);
  }
}
