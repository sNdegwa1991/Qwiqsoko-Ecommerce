import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order/order.service';

interface ShoppingItem {
  product_name: string;
  brand: string;
  quantity: number;
  price?: number;
}

interface Chemist {
  id: number;
  name: string;
  image: string;
  location: string;
  coordinates: string;
}

@Component({
  selector: 'app-drugs-shopping',
  templateUrl: './drugs-shopping.component.html',
  styleUrls: ['./drugs-shopping.component.scss']
})
export class DrugsShoppingComponent implements OnInit, AfterViewInit {

  @ViewChild('search') searchElement!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Steps
  currentStep: number = 1;

  // Step 1: Chemist Selection
  chemists: Chemist[] = [
    { id: 1, name: 'No preferred Chemist', image: 'assets/img/supermarkets/pharm.png', location: 'Qwiq soko to source', coordinates: '-0.425035,36.9557336' },
    { id: 2, name: 'Late Night Chemist', image: 'assets/img/supermarkets/pharm.png', location: 'Nyeri Town', coordinates: '-0.423245,36.952622' },
    { id: 3, name: 'Loyola Pharmaceuticals Ltd', image: 'assets/img/supermarkets/pharm.png', location: 'Nyeri Town', coordinates: '-0.4218812,36.953374' },
    { id: 4, name: 'Rware Pharmacy Ltd', image: 'assets/img/supermarkets/pharm.png', location: 'Nyeri Town', coordinates: '-0.4231318,36.9535756' },
    { id: 5, name: 'Sagana Chemists', image: 'assets/img/supermarkets/pharm.png', location: 'Nyeri Town', coordinates: '-0.4210923,36.9505432' },
    { id: 6, name: 'Plaza Chemists Ltd', image: 'assets/img/supermarkets/pharm.png', location: 'Nyeri Town', coordinates: '-0.4144284,36.9542764' }
  ];
  selectedChemist: Chemist | null = null;

  // Step 2: Shopping List & Prescription
  shoppingList: ShoppingItem[] = [];
  newItem: ShoppingItem = {
    product_name: '',
    brand: '',
    quantity: 1
  };
  
  // Prescription Image Upload
  prescriptionMode: 'manual' | 'prescription' = 'manual';
  selectedPrescriptionFile: File | null = null;
  prescriptionImagePreview: string | null = null;
  prescriptionImageName: string | null = null;
  isUploadingPrescription: boolean = false;

  // Step 3: Map Selection
  center: google.maps.LatLngLiteral = { lat: -0.4195, lng: 36.9577 };
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

  // ==================== STEP 1: SELECT CHEMIST ====================
  selectChemist(chemist: Chemist) {
    if (this.userId === null) {
      this.router.navigate(['/login']);
    } else {
      this.selectedChemist = chemist;
      this.nextStep();
    }
  }

  // ==================== STEP 2: SHOPPING LIST & PRESCRIPTION ====================
  
  switchMode(mode: 'manual' | 'prescription') {
    this.prescriptionMode = mode;
    
    // Clear opposite mode data
    if (mode === 'manual') {
      this.selectedPrescriptionFile = null;
      this.prescriptionImagePreview = null;
      this.prescriptionImageName = null;
    } else {
      this.shoppingList = [];
      this.newItem = { product_name: '', brand: '', quantity: 1 };
    }
  }

  addItemToList() {
    if (!this.newItem.product_name || !this.newItem.brand || this.newItem.quantity < 1) {
      this.toast.warning('Please fill in all fields', 'Incomplete Information');
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

  changeChemist() {
    this.currentStep = 1;
    this.selectedChemist = null;
  }

  // Prescription Image Upload Methods
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onPrescriptionFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.toast.error('Please select a valid image file (JPG, PNG, or GIF)', 'Invalid File');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.toast.error('File size must be less than 5MB', 'File Too Large');
        return;
      }

      this.selectedPrescriptionFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.prescriptionImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePrescriptionImage() {
    this.selectedPrescriptionFile = null;
    this.prescriptionImagePreview = null;
    this.prescriptionImageName = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async uploadPrescriptionImage(): Promise<boolean> {
    if (!this.selectedPrescriptionFile) {
      return false;
    }

    this.isUploadingPrescription = true;

    try {
      const uploadInfo = {
        user_id: this.userId,
        order_id: this.orderId,
        upload_type: 'prescription'
      };

      const response: any = await this.orderService
        .uploadPrescriptionImage(this.selectedPrescriptionFile, uploadInfo)
        .toPromise();

      if (response) {
        // Store the uploaded file name
        this.prescriptionImageName = this.selectedPrescriptionFile.name;
        this.toast.success('Prescription uploaded successfully', 'Success');
        this.isUploadingPrescription = false;
        return true;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading prescription:', error);
      this.toast.error('Failed to upload prescription. Please try again.', 'Upload Error');
      this.isUploadingPrescription = false;
      return false;
    }
  }

  submitShoppingList() {
    if (this.prescriptionMode === 'manual') {
      if (this.shoppingList.length === 0) {
        this.toast.warning('Please add at least one item to your shopping list', 'Empty List');
        return;
      }
    } else {
      if (!this.selectedPrescriptionFile) {
        this.toast.warning('Please upload a prescription image', 'Missing Prescription');
        return;
      }
      // Just validate that prescription is attached, don't upload yet
      this.toast.success('Prescription attached. Please select delivery location.', 'Success');
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
      if (status === 'OK') {
        if (results[0]) {
          this.ngZone.run(() => {
            this.selectedAddress = results[0].name || results[0].formatted_address;
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
          this.toast.error('Unable to get your current location. Please select manually on the map.', 'Location Error');
        }
      );
    }
  }

  async proceedWithLocation() {
    if (!this.markerPosition) {
      this.toast.warning('Please select a delivery location on the map', 'Missing Location');
      return;
    }

    await this.calculateDistanceAndFees();
    this.nextStep();
  }

  // ==================== DISTANCE & FEES CALCULATION ====================
  async calculateDistanceAndFees() {
    if (!this.selectedChemist || !this.markerPosition) {
      console.error('Missing chemist or delivery location');
      return;
    }

    this.isCalculatingFees = true;

    try {
      const [sourceLat, sourceLng] = this.selectedChemist.coordinates
        .split(',')
        .map(coord => parseFloat(coord.trim()));

      const destLat = this.markerPosition.lat;
      const destLng = this.markerPosition.lng;

      this.calculatedDistance = this.calculateDistance(sourceLat, sourceLng, destLat, destLng);
      const roundedDistance = Math.ceil(this.calculatedDistance * 100) / 100;
      this.calculatedDistance = roundedDistance;

      this.orderService.calculateFees(1, roundedDistance).subscribe(
        (response: any) => {
          if (response.dels && response.dels[0]) {
            this.deliveryFees = response.dels[0].fees;
            this.deliveryType = response.dels[0].d_type;
          } else {
            console.error('Invalid fee response');
            this.deliveryFees = 100;
          }
          this.isCalculatingFees = false;
        },
        (error) => {
          console.error('Error calculating fees:', error);
          this.deliveryFees = 100;
          this.isCalculatingFees = false;
          this.toast.warning('Unable to calculate delivery fees. Default fee applied.', 'Calculation Warning');
        }
      );
    } catch (error) {
      console.error('Error in distance calculation:', error);
      this.deliveryFees = 100;
      this.isCalculatingFees = false;
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ==================== STEP 4: ADDITIONAL INFORMATION ====================
  continueToConfirmation() {
    if (!this.dropLocationDescription || !this.contactPerson) {
      this.toast.warning('Please fill in all required fields', 'Incomplete Information');
      return;
    }

    const phoneRegex = /^(07|01)[0-9]{8}$/;
    if (!phoneRegex.test(this.contactPerson.replace(/\s/g, ''))) {
      this.toast.error('Please enter a valid Kenyan phone number', 'Invalid Phone');
      return;
    }

    this.nextStep();
  }

  // ==================== STEP 5: CONFIRMATION & SUBMISSION ====================
  async submitOrder() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      // Generate order ID
      this.orderId = Math.floor(Math.random() * 99999) + 10000;

      // If prescription mode, upload the image first
      if (this.prescriptionMode === 'prescription' && this.selectedPrescriptionFile) {
        this.toast.info('Uploading prescription image...', 'Please Wait');
        const uploadSuccess = await this.uploadPrescriptionImage();
        if (!uploadSuccess) {
          this.isSubmitting = false;
          return;
        }
      }

      const coordinates = `${this.markerPosition?.lat},${this.markerPosition?.lng}`;

      const orderResponse: any = await this.orderService.registerShoppingList(
        this.userId,
        this.orderId,
        this.selectedChemist?.name,
        this.deliveryFees,
        coordinates,
        this.selectedAddress,
        this.dropLocationDescription,
        this.contactPerson,
        this.handOverMethod,
        this.prescriptionImageName
      ).toPromise();

      if (orderResponse && orderResponse[0]?.code === 'reg_success') {
        // Only register individual items if in manual mode
        if (this.prescriptionMode === 'manual' && this.shoppingList.length > 0) {
          const detailsPromises = this.shoppingList.map(item =>
            this.orderService.registerShoppingListDetails(
              this.orderId,
              item.product_name,
              item.brand,
              item.quantity
            ).toPromise()
          );

          await Promise.all(detailsPromises);
        }

        this.toast.success(
          `Order submitted successfully! Order Number: ${orderResponse[0].number}\nDelivery Fee: KES ${this.deliveryFees}.\nWe will contact you for confirmation`,
          'Request Success!',
          {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          }
        );
        
        this.router.navigate(['/my-orders']);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      this.toast.error('Failed to submit order. Please try again.', 'Submission Error');
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