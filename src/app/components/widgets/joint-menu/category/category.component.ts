import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import { SubCategoryComponent } from '../sub-category/sub-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  restoId:any
  restoName: any
  restoImage: any
  restoCateories: any
  img_url = environment.IMG_URL;
  isLoading = true;
  counter = 0;

  constructor(private matDialog: MatDialog, 
    private prodService: ProductService, 
    @Inject(MAT_DIALOG_DATA) public data: {restoId:any, restoName: any,restoImage: any}){
    this.restoId = data.restoId
    this.restoName = data.restoName
    this.restoImage = data.restoId

    this.getRestoCategory(this.restoId)
  }

  ngOnInit(): void {

  }

  openMenu(cat_id: any, cat_name: any){
    this.matDialog.closeAll()
    setTimeout(() => {
     this.openModal(cat_id,cat_name)
    }, 300);
  }

  openModal(cat_id: any, cat_name: any){
    this.matDialog.open(SubCategoryComponent,{
      data: {restoId: this.restoId, catId: cat_id, catName: cat_name, restoName: this.restoName }
    })
  }

  getRestoCategory(restoId: any){
    this.prodService.getRestoMenuCategories(1,restoId).subscribe((res:any) =>{
      this.restoCateories = res.cats;
      this.isLoading = false;
      this.counter = this.restoCateories.length;
    })
  }

}
