import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { SharedServiceService } from 'src/app/services/general/shared-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
   coordinates: any;
   areaName: any;
   distance: any
   receiveMode: any;
   drop: any
   contactNumber: any;
   source: any;
   timeliness: any;
   del_id: any;
   min: any;
   timeframeSet: any;
   scheduleShow=false;
   
  constructor( private matDialog:MatDialog, private router: Router, 
    private sharedService: SharedServiceService,private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: {coords: any,areaName: any,distance: any,source:any}){
    this.coordinates = data.coords;
    this.areaName = data.areaName;
    this.distance = data.distance;
    this.source = data.source;
    this.pastDateTime()
  }

  pastDateTime(){
    var tdate: any = new Date();
    var date:any = tdate.getDate();
    if(date < 10){
      date = "0" + date;
    }

    var month:any = tdate.getMonth() + 1;
    if(month < 10){
      month = "0" + month;
    }
    var year:any = tdate.getFullYear();
    var hours:any = tdate.getHours();
    var minutes:any = tdate.getMinutes();
    this.min = year + "-" + month + "-" + date + "T" + hours + ":" + minutes;


  }

  onOptionChange(selectedOption: string) {
    this.timeliness = selectedOption;

    if(this.timeliness == '3'){
      this.scheduleShow = true;
  } else {
      this.scheduleShow = false;
  }

  }

  proceedToCheckOut(){
    const dropPoint = this.drop
    const receiveMode = this.receiveMode;
    const contactNumber = this.contactNumber;
    const timeliness = this.timeliness;
    const min = this.min;

    if(dropPoint === "" || dropPoint === undefined || receiveMode === "" || receiveMode === undefined || contactNumber === "" || contactNumber === undefined || timeliness === "" || timeliness === undefined){
      this.toast.error('Complete all the fields provided', 'All Fields Required!', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    } else {
      var time_input = document.getElementById('time_input') as HTMLInputElement
      if(this.timeliness == '3')
        {
           localStorage.setItem('timeliness',time_input.value);
        } else {
          localStorage.setItem('timeliness','')
        }

        if(this.timeliness === '3' && time_input.value === '' ){
          alert('Error! Delivery time required for scheduled delivery');
        } else {
        var setDate = '42424355355366366377373';
        var timing = '';
        if(this.timeliness === '3'){
          setDate = time_input.value;
          timing = time_input.value;
        }

        var csetDate = this.min;
        let seldctedTimeStampe = setDate.charAt(0)+setDate.charAt(1)+setDate.charAt(2)+setDate.charAt(3)+setDate.charAt(5)+setDate.charAt(6)+setDate.charAt(8)+setDate.charAt(9)+setDate.charAt(11)+setDate.charAt(12)+setDate.charAt(14)+setDate.charAt(15);
        let currentTimeStamp = csetDate.charAt(0)+csetDate.charAt(1)+csetDate.charAt(2)+csetDate.charAt(3)+csetDate.charAt(5)+csetDate.charAt(6)+csetDate.charAt(8)+csetDate.charAt(9)+csetDate.charAt(11)+csetDate.charAt(12)+csetDate.charAt(14)+csetDate.charAt(15);
        let ctimer = currentTimeStamp.charAt(8)+currentTimeStamp.charAt(9)+currentTimeStamp.charAt(10)+currentTimeStamp.charAt(11);
        let cschedule = seldctedTimeStampe.charAt(8)+seldctedTimeStampe.charAt(9)+seldctedTimeStampe.charAt(10)+seldctedTimeStampe.charAt(11)
        
        const timeDiff = Number(seldctedTimeStampe)-Number(currentTimeStamp);

        if(this.timeliness === '3' && ((Number(cschedule)-Number(ctimer))/100) < 1)
          {
            alert("Sorry! For a scheduled order, there must be atleast 1 hour wait. If required within a shorter time than 1 hour, kindly select one of the above delivery timeframe")
          } else {
            if(this.timeliness == '3'){
              localStorage.setItem('when','Schedule');
              localStorage.setItem('deliverId','1');
            }
            if(this.timeliness == '2'){
              localStorage.setItem('deliverId','1');
              localStorage.setItem('when','Normal');
            }
            if(this.timeliness == '1'){
              localStorage.setItem('when','Urgent');
              localStorage.setItem('deliverId','3');
            }

              //...............................actual
      let drop = this.sharedService.encryptData(dropPoint);
      let mode = this.sharedService.encryptData(receiveMode);
      let contact = this.sharedService.encryptData(contactNumber);
      let distance = this.sharedService.encryptData(this.distance);
      let mapDrop = this.sharedService.encryptData(this.areaName);
      let coods = this.sharedService.encryptData(this.coordinates);
      let source = this.sharedService.encryptData(this.source);
      let time = this.sharedService.encryptData(this.timeliness);
      let actualTime = this.sharedService.encryptData(timing);
      this.router.navigate(['/order-confirmation'],
        { queryParams: {drop: drop,mode: mode,contact: contact,distance:distance,mapDrop: mapDrop,coods:coods,source:source,timeline: time, actualTime: actualTime } })
       this.matDialog.closeAll();

          }

        }

    
        
    }
  }

}
