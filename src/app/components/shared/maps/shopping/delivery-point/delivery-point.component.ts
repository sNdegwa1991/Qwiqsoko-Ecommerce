import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-delivery-point',
  templateUrl: './delivery-point.component.html',
  styleUrls: ['./delivery-point.component.scss']
})
export class DeliveryPointComponent {

  @ViewChild('inputField') inputField!: ElementRef;

  @Input() placeholder = '';

  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(){}

  ngOnInit(): void {}
  ngAfterViewInit(){
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      console.log(place)
    })
  }

}
