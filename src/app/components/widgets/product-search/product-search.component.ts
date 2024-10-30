import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer,ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent {
  
  @ViewChild('quantity') quantityInput: any;
  products: ProductModelServer[] = [];
  catMenu: ProductModelServer[] = [];
  cat_id: any;
  cat_name: any;
  categoris: any;
  subCategories: any;
  filter_field!: string;
  serverURL2 = environment.IMG_URL;
  header_banner: any;
  isLoading = true;

  serviceStat = 0;
  
  constructor(private productService: ProductService,
               private cartService: CartService,
               private route: ActivatedRoute,
               private router: Router,
               private matDialog: MatDialog) {
                this.route.params.subscribe(data => {
                  this.cat_id = data['cat_id'];
                  this.cat_name = data['cat_name'];

                  if(this.cat_id == 1){
                    this.header_banner = 'assets/img/food-banner.png'
                  }
                  if(this.cat_id == 2){
                    this.header_banner = 'assets/img/gas-banner.png'
                  }
                  if(this.cat_id == 3){
                    this.header_banner = 'assets/img/home-page.png'
                  }
                  if(this.cat_id == 4){
                    this.header_banner = 'assets/img/banner-grocer.png'
                  }
                  if(this.cat_id == 5){
                    this.header_banner = 'assets/img/home-page.png'
                  }
                  if(this.cat_id == 6){
                    this.header_banner = 'assets/img/banner-meat.png'
                  }
                  if(this.cat_id == 7){
                    this.header_banner = 'assets/img/banner-cakes.png'
                  }
                  if(this.cat_id == 8){
                    this.header_banner = 'assets/img/home-page.png'
                  }
                  if(this.cat_id == 9){
                    this.header_banner = 'assets/img/home-page.png'
                  }
                  if(this.cat_id == 10){
                    this.header_banner = 'assets/img/home-page.png'
                  }

                  this.productService.getCategoryAnyDetails(this.cat_id,1,15).subscribe((prods: ServerResponse) => {
                    this.products = prods.products;
                    this.isLoading = false;
                    this.serviceStat = this.products.length;
                    
                  });
                  
                  this.productService.getCategoryFromGeneral(this.cat_id).subscribe((cat: ServerResponse) => {
                    this.categoris = cat.cats;
                    //this.serviceStat = this.categoris.length;
                  });
 
                });
                 
                }

  ngOnInit(): void {
    
  }

 

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  getCategorySubmenu(id: any){
    this.productService.getMenuFromCategory(id).subscribe((cat: ServerResponse) => {
      this.catMenu = cat.products;
    });
  }

  qwick_view_product(prod_id: any){
    const dialogRef = this.matDialog.open(ProductQuickViewComponent,{
      data: {prod_id: prod_id}
    })
  }

  selectMenuProducts(cat_id:any,cat_name:any,id: any,name: any){
    this.router.navigate(['menu-product/'+cat_id+'/'+cat_name+'/'+id+'/'+name])
  }
}
