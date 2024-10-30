import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  encryptSecretKey = environment.encryptSecretKey;
  private  SERVER_URL2 = environment.SERVER_URL;
  textSmsShortcode = environment.textSmsShortcode;
   textSmsApi = environment.textSmsApi;
   textSmsPartnerID = environment.textSmsPartnerID;

  constructor(private http: HttpClient) { }

  encryptData(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
}

decryptData(data: any) {

  try {
    const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

getSpecificDeliveryStats(id: any,distance: any): Observable<any>{
  return this.http.get<any>(this.SERVER_URL2+'/get-specific-delivery-stat.php?search='+id+'&&distance='+distance);
}

sendTextSms(message:any,mobile:any){
  return this.http.get('https://sms.textsms.co.ke/api/services/sendsms?apikey='+this.textSmsApi+'&partnerID='+this.textSmsPartnerID+'&message='+message+'&shortcode='+this.textSmsShortcode+'&mobile='+mobile)
}

sendEmail(email: any, subject: any, body: any){
  return this.http.get(`${this.SERVER_URL2}/emailing/send-mail.php?email=${email}&subject=${subject}&body=${body}`);
}
}
