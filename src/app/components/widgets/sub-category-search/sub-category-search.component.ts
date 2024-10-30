import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-category-search',
  templateUrl: './sub-category-search.component.html',
  styleUrls: ['./sub-category-search.component.scss']
})
export class SubCategorySearchComponent {

  products: ProductModelServer[] = [];
  cat_id: any;
  cat_name: any;
  categoris: any;
  catMenu: any;
  subCategories: any;
  filter_field!: string;
  serverURL2 = environment.IMG_URL;
  isLoading = true;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog) {
      this.route.params.subscribe(data => {
        this.cat_id = data['id'];
        this.cat_name = data['name'];

        this.productService.getMenuFromCategory(this.cat_id).subscribe((cat: ServerResponse) => {
          this.catMenu = cat.products;
        });

        this.productService.getProductsFromSubCategory(this.cat_id).subscribe((prods:any) => {
          this.products = prods.products;
          this.isLoading = false;
        });
      });

     }

  ngOnInit(): void {
   
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
  qwick_view_product(prod_id: any){
    const dialogRef = this.matDialog.open(ProductQuickViewComponent,{
      data: {prod_id: prod_id}
    })
  }
}
