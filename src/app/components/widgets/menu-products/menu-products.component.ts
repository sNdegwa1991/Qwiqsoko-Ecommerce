import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';

@Component({
  selector: 'app-menu-products',
  templateUrl: './menu-products.component.html',
  styleUrls: ['./menu-products.component.scss']
})
export class MenuProductsComponent {

  @ViewChild('quantity') quantityInput: any;
  products: ProductModelServer[] = [];
  catMenu: ProductModelServer[] = [];
  cat_id: any;
  cat_name: any;
  menu_id: any;
  menu_name: any;
  categoris: any;
  subCategories: any;
  filter_field!: string;
  serverURL2 = environment.IMG_URL;
  header_banner: any;
  searString:any;
  isLoading = true;
  constructor(private productService: ProductService,
               private cartService: CartService,
               private route: ActivatedRoute,
               private router: Router,
               private matDialog: MatDialog) {
                this.route.params.subscribe(data => {
                  this.menu_id = data['id'];
                  this.menu_name = data['menu_name'];
                  this.cat_id = data['cat_id'];
                  this.cat_name = data['cat_name'];

                  this.productService.getProductsFromSubMenu(this.menu_id).subscribe((prods: ServerResponse) => {
                    this.products = prods.products;
                    this.isLoading = false;
                  });

                  this.productService.getMenuFromCategory(this.cat_id).subscribe((cat: ServerResponse) => {
                    this.catMenu = cat.products;
                  });
 
                });
                 
                }

  ngOnInit(): void {
   
  }

  menuSearch(event: any){
    this.searString = event.target.value;
    this.productService.searchWithinSubMenu(this.menu_id,this.searString).subscribe((prods: ServerResponse) => {
      this.products = prods.products;
      console.log(prods)
    });

  }

  selectMenuProducts(id: any,name: any){
    this.router.navigate(['menu-product/'+this.cat_id+'/'+this.cat_name+'/'+id+'/'+name])
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
}

