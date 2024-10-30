import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductQuickViewComponent } from 'src/app/components/modals/product-quick-view/product-quick-view.component';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  restoId:any
  restoName: any
  restoImage: any
  subCateories: any
  catId: any
  catName: any
  img_url = environment.IMG_URL;
  isLoading = true;
  counter = 0;
  menuId: any
  menuName:any
  itemMenu: any
  searString: any

  constructor(private matDialog: MatDialog, 
    private cartService: CartService,
    private prodService: ProductService, 
    @Inject(MAT_DIALOG_DATA) public data: {menuId: any, menuName:any,restoId: any, restoName: any}){
    this.menuId = data.menuId
    this.menuName = data.menuName
    this.restoId = data.restoId
    this.restoName = data.restoName
   
    this.getSubMenuItems(this.menuId,this.restoId)
  }

  ngOnInit(): void {

  }
  getSubMenuItems(cat_id: any,menuName: any){
    console.log(cat_id,menuName)
    this.prodService.getRestoMenuSubmenu(cat_id,this.restoId).subscribe((res:any) =>{
      this.itemMenu = res.products;
      console.log(this.itemMenu)
      this.isLoading = false;
      this.counter = this.itemMenu.length;
    })
  }

  AddToCart(id: number) {
    //  console.log('prod:'+id)
    this.cartService.AddProductToCart(id);
    }

    qwick_view_product(prod_id: any){
      const dialogRef = this.matDialog.open(ProductQuickViewComponent,{
        data: {prod_id: prod_id}
      })
    }
    
    searchProducts(prod: any){
      this.searString = prod.target.value;
       this.prodService.searchWithinMenu(prod.target.value,this.menuId,this.restoId).subscribe((res: any) =>{
      this.itemMenu = res.products;
     
     })
    }
}
