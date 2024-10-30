import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { LocationFormComponent } from '../location-form/location-form.component';
import { JointsService } from 'src/app/services/joints/joints.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  @ViewChild('search') searchElement!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;

  center: google.maps.LatLngLiteral = {lat: -1.2921, lng: 36.8219}; // Nairobi coordinates as default
  zoom = 10;
  markerPosition!: google.maps.LatLngLiteral;
  marker: any;
  areaName: string = '';
  auth = localStorage.getItem('soko-token');
  cartData!: CartModelServer;
  restoCoodLat: any;
  restoCoodLng: any;
  totalItems: any;
  restoArray: any[]=[];
  restoArray1: any[]=[];
  restoArray2: any[]=[];
  myCart: any
  sourceName: any;
  constructor(private ngZone: NgZone,private router: Router,public cartService: CartService,
    private matDialog: MatDialog, private jointServices: JointsService) {
    if(this.auth === '' || this.auth === null)
      {
        router.navigate(['/login'])
      }

    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.getSourceCoordinates();   
  }

  ngOnInit() {
    this.getCurrentPosition();
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  //.............................get the restaurant/source coordinates;
  getSourceCoordinates(){
    this.myCart = localStorage.getItem("cart");
    const jsonObject = JSON.parse(this.myCart);
    //console.log(jsonObject?.prodData)
    this.totalItems = jsonObject?.prodData.length;

    for(var i=0;i<this.totalItems;i++){
      var restoId = this.cartData.data[i].product?.restoId
      var restoName = this.cartData.data[i].product?.restaurant
      var restoCoords = this.cartData.data[i].product?.coordinates;

      if (!this.restoArray.includes(restoId)) {
        this.restoArray.push(restoId);
        this.restoArray1.push(restoName);
        this.restoArray2.push(restoCoords);
      }

    }
    localStorage.setItem("restoId",'['+this.restoArray.toString()+']')
    localStorage.setItem("restoName",'['+this.restoArray1.toString()+']')
    localStorage.setItem("restoCoords",'['+this.restoArray2.toString()+']')

    //.........................get source coordinates
    var totalSources = this.restoArray.length;
    if(totalSources>1){
      //-----------------------------multiple source----consider office as the source
      this.jointServices.getJointDetails(3).subscribe((res: any)=>{
        let coords = res.restaurants[0].coordinates;

        this.sourceName = 'MULTIPLE SOURCES:-  '+this.restoArray1.toString();
        const [lat, lng] = coords.split(',').map(Number);
        
        this.restoCoodLat = lat;
        this.restoCoodLng = lng;
      })

    } else {
      //------------------------------Get the coordinates of the given source
      let restoName = this.restoArray1[0];
      let coords = this.restoArray2[0];

      this.sourceName = restoName;
      const [lat, lng] = coords.split(',').map(Number);
      
      this.restoCoodLat = lat;
      this.restoCoodLng = lng;
      
    }
   
  }


  getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log('User location:', userLocation);
            this.initMapWithUserLocation(userLocation);
          });
        },
        (error) => {
          console.error('Error getting current position:', error);
          this.handleGeolocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      this.initMapWithUserLocation(this.center);
    }
  }

  handleGeolocationError(error: GeolocationPositionError) {
    let errorMessage = 'Unable to retrieve your location. ';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage += 'The request to get user location timed out.';
        break;
      default:
        errorMessage += 'An unknown error occurred.';
        break;
    }
    alert(errorMessage);
    this.initMapWithUserLocation(this.center); // Fallback to default (Nairobi)
  }

  initMapWithUserLocation(location: google.maps.LatLngLiteral) {
  console.log('Initializing map with location:', location);
  this.center = location;
  this.markerPosition = location;
  this.addVisibleMarker(location);
  this.getAreaName(location);
}

  initAutocomplete() {
    const options = {
      componentRestrictions: { country: 'ke' },
      fields: ['address_components', 'geometry', 'name'],
      strictBounds: false
    };

    const autocomplete:any = new google.maps.places.Autocomplete(this.searchElement.nativeElement, options);
    
    // Bias the results towards the user's current location
    autocomplete.setBounds(new google.maps.Circle({
      center: this.center,
      radius: 10000 // 10km radius
    }).getBounds());

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.warn("No details available for input: '" + place.name + "'");
        return;
      }

      this.ngZone.run(() => {
        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.zoom = 15;
        this.addMarkerToPlace(place);
        console.log(this.center)
      });
    });
  }

 addMarkerToPlace(place: any) {
    this.markerPosition = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    this.areaName = place.name;

    this.addVisibleMarker(this.markerPosition);
  }

addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      console.log('Marker position:', event);

      this.addVisibleMarker(this.markerPosition);

      // Get the area name for the clicked location
      this.getAreaName(this.markerPosition);
    }
  }

  addVisibleMarker(position: google.maps.LatLngLiteral) {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: position,
      map: this.map.googleMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });
  }

  getAreaName(position: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.ngZone.run(() => {
            this.areaName = results[0].formatted_address;
          });
        } else {
          console.warn('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  saveDeliveryPoint() {
    if (this.markerPosition && this.areaName) {
      const deliveryPoint = {
        coordinates: this.markerPosition,
        areaName: this.areaName
      };
     var coordinatesDestin = this.markerPosition.lat+','+this.markerPosition.lng; 
     var distance = this.calculateDistance(this.restoCoodLat,this.restoCoodLng,this.markerPosition.lat,this.markerPosition.lng)
     var roundOffDistance =  Math.ceil(distance * 100) / 100
     const dialogRef = this.matDialog.open(LocationFormComponent , {
      data: {coords: coordinatesDestin,areaName: this.areaName,distance: roundOffDistance,source: this.restoArray1}
     });


    } else {
      console.warn('No delivery point selected or area name not available');
    }
  }
calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
}