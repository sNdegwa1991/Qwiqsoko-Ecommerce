import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';

@Component({
  selector: 'app-joint-menu',
  templateUrl: './joint-menu.component.html',
  styleUrls: ['./joint-menu.component.scss']
})
export class JointMenuComponent {
  @ViewChild('quantity') quantityInput: any;
  products: ProductModelServer[] = [];
  catMenu: ProductModelServer[] = [];
  resto_id: any;
  resto_name: any;
  categoris: any;
  subCategories: any;
  filter_field!: string;
  serverURL2 = environment.IMG_URL;
  restoImg = environment.IMG_URL_RESTO
  header_banner: any;
  searString: any
  availability = 0;
  isLoading = true;


  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog) {
     this.route.params.subscribe(data => {
       this.resto_id = data['jointId'];
       this.resto_name = data['resto'];
       this.header_banner = data['image'];
     })

     this.getRestoMenu();
    }

    ngOnInit(): void {
    
    }

    jointSearch(event: any){
      this.searString = event.target.value;
      this.productService.generalSearchWithinResto(this.resto_id,this.searString).subscribe((prods: ServerResponse) => {
        this.products = prods.products;
        this.isLoading = false;
        this.availability = this.products.length;
      });

    }
    getRestoMenu(){
      this.productService.getARestaurantsMenus(this.resto_id).subscribe((prods: ServerResponse) => {
        this.products = prods.products;
        this.isLoading = false;
        this.availability = this.products.length;
      });
    
      this.productService.getCategoryFromGeneral(1).subscribe((cat: ServerResponse) => {
        this.categoris = cat.cats;
      });
    }

    AddToCart(id: number) {
    //  console.log('prod:'+id)
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
