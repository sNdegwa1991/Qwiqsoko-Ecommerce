import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] =[];
  private  SERVER_URL = environment.SERVER_URL;
  private REMOTE = environment.REMOTE_SERVER_URL;

  constructor(private http: HttpClient ) { }

  getSingleOrder(orderId: number) {
    return this.http.get<any>(this.SERVER_URL + '/read-order-details.php?id=' + orderId).toPromise();
  }

  payOrder(phone: any,amount: any,orderId: any,userId:any,purpose: any,amountDue: any){
    return this.http.get(this.REMOTE+'/mpesa-initiate.php?mpesa=true&phone='+phone+'&amount='+amount+'&id='+orderId+'&userId='+userId+'&purpose='+purpose+'&due='+amountDue);
  } 

  getOrderDetails(order: string){
    return this.http.get(this.SERVER_URL+'/get-order-details.php?search='+order);
    
  }
  getOtherOrderCosts(order: any): Observable<any>{
    return this.http.get<any>(this.SERVER_URL+'/get-other-costs.php?search='+order);
  }

  getOrderStatus(order: any){
    return this.http.get(this.SERVER_URL+'/get-specific-order.php?search='+order);
  }

  getReviewedOrderDetails(order: string){
    return this.http.get(this.SERVER_URL+'/get-reviewed-orders.php?search='+order);
    
  }

  registerOder(user: any,order: any,cord: any,addr: any,build: any,info: any,deliver: any,delivery_id: any,
    resto_id: any,contact: any,hand_over:any,notes:any,timeframe: any, timelines: any){
    let theAdress = addr.replace(/[^a-zA-Z ]/g, "");
    let theBuild = build.replace(/[^a-zA-Z ]/g, "");
    let theInfo = info.replace(/[^a-zA-Z ]/g, "");
   // let currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
   
    if(notes == null){
      notes = 'Unprovided';
    }
   let theNote = notes.replace(/[^a-zA-Z ]/g, "");
   let custSms = "Order Alert! "+timelines+" Order number "+order+" has been placed. Open the App to view the details";
   //this.apiService.sendTextSms(custSms,this.myPhone)
  return this.http.get(this.SERVER_URL+'/register-order.php?user_id='+user+'&order_id='+order+'&coordinates='+cord+'&address='+theAdress+'&building='+theBuild+'&information='+theInfo+'&delivery_fees='+deliver+'&delivery_id='+delivery_id+'&resto_id='+resto_id+'&contact='+contact+'&notes='+theNote+'&hand_over='+hand_over+'&time_frame='+timeframe+'&timelines='+timelines);

}

registerOrderDetails(orderId: any, product: any, quantity: any, price: any) {
  return this.http.get(this.SERVER_URL+'/register-order-details.php?order_id='+orderId+'&&avail_id='+product+'&&quantity='+quantity+'&&price='+price)
}

getUserOrders(userId: any): Observable<any>{
  return this.http.get<any>(this.SERVER_URL+'/get-user-orders.php?user_id='+userId);
}

getUserPayments(user: any){
  return this.http.get(this.SERVER_URL+'/get-user-payments.php?user_id='+user);
}

getOrderPayments(order: any){
  return this.http.get(this.SERVER_URL+'/get-order-payments.php?order_id='+order);
}
getSpecificOrder(order:any){
  return this.http.get(this.SERVER_URL+'/push-order-to-restaurant.php?order_id='+order);
}

 registerShoppingList(user: any,order: any,supa: any,fees:any,cords: any,address: any,info:any,cantact: any,handover: any, shoppingListImage: string | null = null){
    let theAdress = address.replace(/[^a-zA-Z ]/g, "");
      let theInfo = info.replace(/[^a-zA-Z ]/g, "");
      let theSupa = supa.replace(/[^a-zA-Z ]/g, "");
    return this.http.get(this.SERVER_URL+'/register-shopping-list.php?user_id='+user+'&order_id='+order+'&supa='+theSupa+'&delivery_fees='+fees+'&coordinates='+cords+'&address='+theAdress+'&information='+theInfo+'&contact_person='+cantact+'&hand_over='+handover+'&shopping_list_image='+shoppingListImage);
  }
  
  registerShoppingListDetails(orderId: any, name: any, brand: any, quantity: any) {
    return this.http.get(this.SERVER_URL+'/register-shopping-list-details.php?order_id='+orderId+'&item_name='+name+'&quantity='+quantity+'&brand='+brand)
  }

  calculateFees(id: any,distance: any): Observable<any>{
  return this.http.get<any>(this.SERVER_URL+'/get-specific-delivery-stat.php?search='+id+'&&distance='+distance);
}

getUserShoppingList(user_id: string){
    return this.http.get(this.SERVER_URL+'/get-user-shopping-list.php?search='+user_id);
    
  }

  uploadPrescriptionImage(file: File, info: any): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tz', new Date().toISOString());
  formData.append('info', JSON.stringify(info));

  return this.http.post(`${this.SERVER_URL}/upload-receipt.php`, formData);
}


}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

