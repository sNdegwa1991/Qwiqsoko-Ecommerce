import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { CartModelServer } from 'src/app/models/cart.model';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import {MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) trigger1!: MatMenuTrigger;
  cartData!: CartModelServer;
  categoryFood: ProductModelServer[] = [];
  categoryGrocery: ProductModelServer[] = [];
  categoryMeat: ProductModelServer[] = [];
  categoryGas: ProductModelServer[] = [];
  categoryCake: ProductModelServer[] = [];
  categoryBeer: ProductModelServer[] = [];
  catMenu: ProductModelServer[] = [];
  cartTotal: any;
  authState:any;
  searchName: any;
  products: any;
  serverURL2 = environment.IMG_URL;
  auth = localStorage.getItem('soko-token');
  email = 'info@qwiqsoko.com';
  user = localStorage.getItem('user');

  selectedCat: any;
  
  constructor(public cartService: CartService,
              private route: Router,
              private userService: UserService,
              private productService: ProductService) { 
                this.populateData();
                this.authState = localStorage.getItem('soko-auth');
                console.log('auth: '+this.authState)

              }

  ngOnInit(): void {
  }

  populateData(){
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);

    this.productService.getCategoryFromGeneral(1).subscribe((cat: ServerResponse) => {
      this.categoryFood = cat.cats;
    });

    this.productService.getCategoryFromGeneral(4).subscribe((cat: ServerResponse) => {
      this.categoryGrocery = cat.cats;
    });

    this.productService.getCategoryFromGeneral(6).subscribe((cat: ServerResponse) => {
      this.categoryMeat = cat.cats;
    });

    this.productService.getCategoryFromGeneral(2).subscribe((cat: ServerResponse) => {
      this.categoryGas = cat.cats;
    });

    this.productService.getCategoryFromGeneral(7).subscribe((cat: ServerResponse) => {
      this.categoryCake = cat.cats;
    });

    this.productService.getCategoryFromGeneral(5).subscribe((cat: ServerResponse) => {
      this.categoryBeer = cat.cats;
    });
  }

  onChange(value: any) {
    this.selectedCat = value.target.value;
    var cate = '';
    if(this.selectedCat == 1) { cate = 'Fast Food & Beverages'}
    if(this.selectedCat == 2) { cate = 'Cooking Gas Refilling'}
    if(this.selectedCat == 7) { cate = 'Cake & Confectionaries'}
    if(this.selectedCat == 6) { cate = 'Meat & Meat Products'}
    if(this.selectedCat == 4) { cate = 'Groceries'}
    if(this.selectedCat == 5) { cate = 'Liquor & Energy Drinks'}
    
    this.selectCategory(this.selectedCat,cate);

}


  selectCategory(cat_id:any,catName: any) {
    this.route.navigate(['/categories-view/'+cat_id+'/'+catName]).then();
  }

  getCategorySubmenu(id: any){
    this.productService.getMenuFromCategory(id).subscribe((cat: ServerResponse) => {
      this.catMenu = cat.products;
    });
  }

  submitSearch(form: NgForm) {
      const searchName: string = this.searchName;

        this.route.navigate(['product-search/1/16/'+searchName])
      
  }

  selectMenuProducts(cat_id:any,cat_name:any,id: any,name: any){
    this.route.navigate(['menu-product/'+cat_id+'/'+cat_name+'/'+id+'/'+name])
  }
  
  openMyMenu() {
    this.trigger.toggleMenu();
  } 
  openMyMenu1() {
    this.trigger1.toggleMenu();
  } 

  closeMyMenu() {
    this.trigger.closeMenu();
    console.log('close')
  } 
  
  selectSubCategory(cat_id: any,name: any){
    this.route.navigate(['/sub-category/'+cat_id+'/'+name])
  }

}
