import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-general-search',
  templateUrl: './general-search.component.html',
  styleUrls: ['./general-search.component.scss']
})
export class GeneralSearchComponent {

  start_page: any;
  pages_limit: any;
  searchKey: any;

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

  constructor(private route: ActivatedRoute,
               private productService: ProductService,
               private cartService: CartService,
               private router: Router,
               private matDialog: MatDialog){
      this.route.params.subscribe(data => {
      this.start_page = data['start'];
      this.pages_limit = data['limit'];
      this.searchKey = data['key'];

      this.productService.generalSearchingWithPaging(this.searchKey,this.start_page,this.pages_limit).subscribe((prods: ServerResponse) => {
        this.products = prods.products;
      });
      
      this.productService.getCategoryFromGeneral(1).subscribe((cat: ServerResponse) => {
        this.categoris = cat.cats;
      });

    });
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
