import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { HomeComponent } from './components/shared/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LoginComponent } from './components/template/login/login.component';
import { ProfileComponent } from './components/template/profile/profile.component';
import {HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CartComponent } from './components/widgets/cart/cart.component';
import { CheckoutComponent } from './components/widgets/checkout/checkout.component';
import { ProductComponent } from './components/widgets/product/product.component';
import { ProductSearchComponent } from './components/widgets/product-search/product-search.component';
import { SubCategorySearchComponent } from './components/widgets/sub-category-search/sub-category-search.component';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { SidebarModule } from 'ng-cdbangular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import { ImageModule } from 'primeng/image';
import { ProductQuickViewComponent } from './components/modals/product-quick-view/product-quick-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MenuProductsComponent } from './components/widgets/menu-products/menu-products.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { GeneralSearchComponent } from './components/widgets/general-search/general-search.component';
import { DeliveryPointComponent } from './components/shared/maps/shopping/delivery-point/delivery-point.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { LocationFormComponent } from './components/widgets/location-form/location-form.component';
import { OrderConfirmationComponent } from './components/widgets/order-confirmation/order-confirmation.component';
import { ThankyouComponent } from './components/widgets/thankyou/thankyou.component';
import { OrderDetailsComponent } from './components/widgets/order-details/order-details.component';
import { OrderPaymentComponent } from './components/widgets/order-payment/order-payment.component';
import { UserPaymentsComponent } from './components/widgets/user-payments/user-payments.component';
import { UserRegisterComponent } from './components/widgets/user-register/user-register.component';
import { JointMenuComponent } from './components/widgets/joint-menu/joint-menu.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MyOrdersComponent } from './components/widgets/my-orders/my-orders.component';
import { CategoryComponent } from './components/widgets/joint-menu/category/category.component';
import { SubCategoryComponent } from './components/widgets/joint-menu/sub-category/sub-category.component';
import { ItemsComponent } from './components/widgets/joint-menu/items/items.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    ProfileComponent,
    CartComponent,
    CheckoutComponent,
    ProductComponent,
    ProductSearchComponent,
    SubCategorySearchComponent,
    ProductQuickViewComponent,
    MenuProductsComponent,
    GeneralSearchComponent,
    DeliveryPointComponent,
    LocationFormComponent,
    OrderConfirmationComponent,
    ThankyouComponent,
    OrderDetailsComponent,
    OrderPaymentComponent,
    UserPaymentsComponent,
    UserRegisterComponent,
    JointMenuComponent,
    MyOrdersComponent,
    CategoryComponent,
    SubCategoryComponent,
    ItemsComponent
    
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MdbCheckboxModule,
    MdbCarouselModule,
    SidebarModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatListModule,
    ImageModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatToolbarModule,
    GoogleMapsModule,
    MatRadioModule,
    MatTabsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
