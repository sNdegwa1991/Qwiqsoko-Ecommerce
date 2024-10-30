import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { ItemsComponent } from '../items/items.component';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent {
  restoId:any
  restoName: any
  restoImage: any
  subCateories: any
  catId: any
  catName: any
  img_url = environment.IMG_URL;
  isLoading = true;
  counter = 0;

  constructor(private matDialog: MatDialog, 
    private prodService: ProductService, 
    @Inject(MAT_DIALOG_DATA) public data: {restoId: any, catId: any, catName: any, restoName: any}){
    this.restoId = data.restoId
    this.restoName = data.restoName
    this.catName = data.catName
    this.catId = data.catId
    
    this.getCategorySubMenu(this.restoId,this.catId)
  }

  ngOnInit(): void {

  }
  getCategorySubMenu(restoId: any,cat_id: any){
    this.prodService.getRestoMenu(cat_id,restoId).subscribe((res:any) =>{
      this.subCateories = res.products;
      console.log(this.subCateories)
      this.isLoading = false;
      this.counter = this.subCateories.length;
    })
  }

  getMenuSubMenu(menuId: any, menu_name: any){
    this.matDialog.closeAll()
    setTimeout(() => {
     this.openModal(menuId,menu_name)
    }, 300);
  }

  openModal(cat_id: any, cat_name: any){
    this.matDialog.open(ItemsComponent,{
      data: {menuId: cat_id, menuName:cat_name, restoId: this.restoId, restoName: this.restoName}
    })
  }

}
