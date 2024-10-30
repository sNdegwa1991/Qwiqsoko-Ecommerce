import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/shared/home/home.component';
import { CartComponent } from './components/widgets/cart/cart.component';
import { ProductComponent } from './components/widgets/product/product.component';
import { ProductSearchComponent } from './components/widgets/product-search/product-search.component';
import { SubCategorySearchComponent } from './components/widgets/sub-category-search/sub-category-search.component';
import { MenuProductsComponent } from './components/widgets/menu-products/menu-products.component';
import { GeneralSearchComponent } from './components/widgets/general-search/general-search.component';
import { DeliveryPointComponent } from './components/shared/maps/shopping/delivery-point/delivery-point.component';
import { CheckoutComponent } from './components/widgets/checkout/checkout.component';
import { LoginComponent } from './components/template/login/login.component';
import { ProfileComponent } from './components/template/profile/profile.component';
import { OrderConfirmationComponent } from './components/widgets/order-confirmation/order-confirmation.component';
import { ThankyouComponent } from './components/widgets/thankyou/thankyou.component';
import { OrderDetailsComponent } from './components/widgets/order-details/order-details.component';
import { UserPaymentsComponent } from './components/widgets/user-payments/user-payments.component';
import { UserRegisterComponent } from './components/widgets/user-register/user-register.component';
import { JointMenuComponent } from './components/widgets/joint-menu/joint-menu.component';
import { MyOrdersComponent } from './components/widgets/my-orders/my-orders.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'categories-view/:cat_id/:cat_name',
    component: ProductSearchComponent
  },
  {
    path: 'sub-category/:id/:name',
    component: SubCategorySearchComponent
  },
  {
    path: 'menu-product/:cat_id/:cat_name/:id/:menu_name',
    component: MenuProductsComponent
  },
  {
    path: 'product-search/:start/:limit/:key',
    component: GeneralSearchComponent
  },
  {
    path: 'delivery-point',
    component: DeliveryPointComponent
  },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  },
  {
    path: 'order-details/:orderId',
    component: OrderDetailsComponent
  },
  {
    path: 'my-payments/:userId',
    component: UserPaymentsComponent
  },
  {
    path: 'register',
    component: UserRegisterComponent
  },
  {
    path: 'joint-menu/:jointId/:resto/:image',
    component: JointMenuComponent
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
