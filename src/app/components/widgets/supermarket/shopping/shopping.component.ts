import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedServiceService } from 'src/app/services/general/shared-service.service';
import { OrderService } from 'src/app/services/order/order.service';

interface ShoppingItem {
  product_name: string;
  brand: string;
  quantity: number;
  price?: number;
}

interface Supermarket {
  id: number;
  name: string;
  image: string;
  location: string;
  coordinates: string;
}
@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit, AfterViewInit {

  @ViewChild('search') searchElement!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;

  // Steps
  currentStep: number = 1;

  // Step 1: Supermarket Selection
  supermarkets: Supermarket[] = [
    { id: 1, name: 'Naivas', image: 'assets/img/supermarkets/naivas1.png', location: 'Nyeri Town', coordinates: '-0.425035,36.9557336' },
    { id: 2, name: 'Mathai', image: 'assets/img/supermarkets/mathai1.jpg', location: 'Nyeri Town', coordinates: '-0.423245,36.952622' },
    { id: 3, name: 'Chieni', image: 'assets/img/supermarkets/chieni1.jpg', location: 'Nyeri Town', coordinates: '-0.4218812,36.953374' },
    { id: 4, name: 'Samrat', image: 'assets/img/supermarkets/sam.jpeg', location: 'Nyeri Town', coordinates: '-0.4231318,36.9535756' },
    { id: 5, name: 'Khetias', image: 'assets/img/supermarkets/khetias1.jpg', location: 'Nyeri Town', coordinates: '-0.4210923,36.9505432' },
    { id: 6, name: 'Siel', image: 'assets/img/supermarkets/siel1.jpg', location: 'Kingongo, Nyeri Town', coordinates: '-0.4144284,36.9542764' },
    { id: 7, name: 'Magunas', image: 'assets/img/supermarkets/maguna.jpg', location: 'Nyeri Town', coordinates: '-0.4245791,36.9544029' },
    { id: 8, name: 'Central', image: 'assets/img/supermarkets/central.png', location: 'Skuta, Nyeri Town', coordinates: '-0.4356868,36.9707864' }
  ];
  selectedSupermarket: Supermarket | null = null;

  // Step 2: Shopping List
  shoppingList: ShoppingItem[] = [];
  newItem: ShoppingItem = {
    product_name: '',
    brand: '',
    quantity: 1
  };

  // Step 3: Map Selection
  center: google.maps.LatLngLiteral = { lat: -0.4195, lng: 36.9577 }; // Nyeri coordinates
  zoom = 14;
  markerPosition: google.maps.LatLngLiteral | null = null;
  marker: any;
  selectedAddress: string = '';
  
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };

  mapPreviewOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'none'
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    animation: google.maps.Animation.DROP
  };

  // Step 4: Additional Information
  dropLocationDescription: string = '';
  contactPerson: string = '';
  handOverMethod: string = 'Leaving at the door';
  handOverOptions: string[] = [
    'Leaving at the door',
    'Hand to customer',
    'Hand to security',
    'Call on arrival'
  ];

  // Step 5: Confirmation
  isSubmitting: boolean = false;
  deliveryFees: number = 0;
  calculatedDistance: number = 0;
  isCalculatingFees: boolean = false;
  deliveryType: string = '';
  userId: any;
  orderId: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private ngZone: NgZone,
    private toast: ToastrService
  ) {
    this.userId = localStorage.getItem('uid');

  }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.searchElement && this.currentStep === 3) {
        this.initAutocomplete();
      }
    }, 500);
  }

  // ==================== STEP 1: SELECT SUPERMARKET ====================
  selectSupermarket(supermarket: Supermarket) {
    if(this.userId === null){
      this.router.navigate(['/login'])

    } else {
    this.selectedSupermarket = supermarket;
    this.nextStep();
    }
  }

  // ==================== STEP 2: SHOPPING LIST ====================
  addItemToList() {
    if (!this.newItem.product_name || !this.newItem.brand || this.newItem.quantity < 1) {
      alert('Please fill in all fields');
      return;
    }

    this.shoppingList.push({ ...this.newItem });
    
    this.newItem = {
      product_name: '',
      brand: '',
      quantity: 1
    };
  }

  removeItem(index: number) {
    this.shoppingList.splice(index, 1);
  }

  increaseQuantity(index: number) {
    this.shoppingList[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.shoppingList[index].quantity > 1) {
      this.shoppingList[index].quantity--;
    }
  }

  changeSupermarket() {
    this.currentStep = 1;
    this.selectedSupermarket = null;
  }

  submitShoppingList() {
    if (this.shoppingList.length === 0) {
      alert('Please add at least one item to your shopping list');
      return;
    }
    this.nextStep();
  }

  // ==================== STEP 3: MAP SELECTION ====================
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.zoom = 14;
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.handleGeolocationError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
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
    console.warn(errorMessage);
  }

  initAutocomplete() {
    if (!this.searchElement) {
      console.error('Search element not found');
      return;
    }

    const options = {
      componentRestrictions: { country: 'ke' },
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
      strictBounds: false
    };

    const autocomplete: any = new google.maps.places.Autocomplete(
      this.searchElement.nativeElement, 
      options
    );
    
    autocomplete.setBounds(new google.maps.Circle({
      center: this.center,
      radius: 10000
    }).getBounds());

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.warn("No details available for input: '" + place.name + "'");
        return;
      }

      this.ngZone.run(() => {
        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.zoom = 16;
        this.markerPosition = this.center;
        console.log(place)
        this.selectedAddress = place.name || place.formatted_address || '';
        this.addVisibleMarker(this.markerPosition);
      });
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.addVisibleMarker(this.markerPosition);
      this.getAddressFromLatLng(this.markerPosition);
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
      },
      draggable: true
    });

    this.marker.addListener('dragend', (event: any) => {
      this.ngZone.run(() => {
        this.markerPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        this.getAddressFromLatLng(this.markerPosition);
      });
    });
  }

  clearMarker() {
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
    this.markerPosition = null;
    this.selectedAddress = '';
  }

  getAddressFromLatLng(position: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results: any, status: any) => {
      //console.log(results)
      if (status === 'OK') {
        if (results[0]) {
          this.ngZone.run(() => {
            this.selectedAddress = results[0].name || results[0].formatted_address;
            console.log(results)
          });
        } else {
          console.warn('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.center = location;
            this.markerPosition = location;
            this.zoom = 16;
            this.addVisibleMarker(location);
            this.getAddressFromLatLng(location);
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
        }
      );
    }
  }

  async proceedWithLocation() {
    if (!this.markerPosition) {
      alert('Please select a delivery location on the map');
      return;
    }

    // Calculate distance and fees before proceeding
    await this.calculateDistanceAndFees();
    
    // Proceed to next step
    this.nextStep();
  }

  // ==================== DISTANCE & FEES CALCULATION ====================
  async calculateDistanceAndFees() {
    if (!this.selectedSupermarket || !this.markerPosition) {
      console.error('Missing supermarket or delivery location');
      return;
    }

    this.isCalculatingFees = true;

    try {
      // Get supermarket coordinates
      const [sourceLat, sourceLng] = this.selectedSupermarket.coordinates
        .split(',')
        .map(coord => parseFloat(coord.trim()));

      // Get delivery point coordinates
      const destLat = this.markerPosition.lat;
      const destLng = this.markerPosition.lng;

      // Calculate distance
      this.calculatedDistance = this.calculateDistance(sourceLat, sourceLng, destLat, destLng);
      
      // Round off to 2 decimal places
      const roundedDistance = Math.ceil(this.calculatedDistance * 100) / 100;
      this.calculatedDistance = roundedDistance;

      // Get delivery fees from API
      this.orderService.calculateFees(1,roundedDistance).subscribe(
        (response: any) => {
          if (response.dels && response.dels[0]) {
            this.deliveryFees = response.dels[0].fees;
            this.deliveryType = response.dels[0].d_type;
            console.log('Delivery fees calculated:', this.deliveryFees);
          } else {
            console.error('Invalid fee response');
            this.deliveryFees = 100; // Default fallback
          }
          this.isCalculatingFees = false;
        },
        (error) => {
          console.error('Error calculating fees:', error);
          this.deliveryFees = 100; // Default fallback
          this.isCalculatingFees = false;
          alert('Unable to calculate delivery fees. Default fee applied.');
        }
      );
    } catch (error) {
      console.error('Error in distance calculation:', error);
      this.deliveryFees = 100; // Default fallback
      this.isCalculatingFees = false;
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

  // ==================== STEP 4: ADDITIONAL INFORMATION ====================
  continueToConfirmation() {
    if (!this.dropLocationDescription || !this.contactPerson) {
      alert('Please fill in all required fields');
      return;
    }

    const phoneRegex = /^(07|01)[0-9]{8}$/;
    if (!phoneRegex.test(this.contactPerson.replace(/\s/g, ''))) {
      alert('Please enter a valid Kenyan phone number');
      return;
    }

    this.nextStep();
  }

  // ==================== STEP 5: CONFIRMATION & SUBMISSION ====================
  async submitOrder() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      this.orderId = Math.floor(Math.random() * 99999) + 10000;
      const coordinates = `${this.markerPosition?.lat},${this.markerPosition?.lng}`;

      const orderResponse:any = await this.orderService.registerShoppingList(
        this.userId,
        this.orderId,
        this.selectedSupermarket?.name,
        this.deliveryFees,
        coordinates,
        this.selectedAddress,
        this.dropLocationDescription,
        this.contactPerson,
        this.handOverMethod
      ).toPromise();

      if (orderResponse && orderResponse[0]?.code === 'reg_success') {
        const detailsPromises = this.shoppingList.map(item =>
          this.orderService.registerShoppingListDetails(
            this.orderId,
            item.product_name,
            item.brand,
            item.quantity
          ).toPromise()
        );

        await Promise.all(detailsPromises);

        //alert(`Order submitted successfully! Order Number: ${orderResponse[0].number}\nDelivery Fee: KES ${this.deliveryFees}`);
        this.toast.success(`Order submitted successfully! Order Number: ${orderResponse[0].number}\nDelivery Fee: KES ${this.deliveryFees}.\n We will contact you for confimation`, 'Request Sucess!', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
        this.router.navigate(['/my-orders']);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  reviewOrder() {
    this.currentStep = 2;
  }

  // ==================== NAVIGATION ====================
  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
      
      if (this.currentStep === 3) {
        setTimeout(() => {
          this.initAutocomplete();
        }, 500);
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  

}
