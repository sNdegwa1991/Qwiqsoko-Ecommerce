import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';
import {MatMenuTrigger} from '@angular/material/menu'
import { MatDialog } from '@angular/material/dialog';
import { ProductQuickViewComponent } from '../../modals/product-quick-view/product-quick-view.component';
import { MatTabGroup } from '@angular/material/tabs';
import { interval, Subscription } from 'rxjs';
import { CategoryComponent } from '../../widgets/joint-menu/category/category.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild(MatTabGroup) tabGroup1!: MatTabGroup;

  products: ProductModelServer[] = [];
  foods: ProductModelServer[] = [];
  cookingGas: ProductModelServer[] = [];
  allMeat: ProductModelServer[] = [];
  category: ProductModelServer[] = [];
  catMenu: ProductModelServer[] = [];
  img_url = environment.IMG_URL;
  img_url_resto = environment.IMG_URL_RESTO;
  img_menu = environment.SERVER_URL+'/images/cat'
page: any;
total_products: any;
total_pages: any;
isLoading = true;
toNextPage = false;

food_start = 1;
food_limit = 4;
total_food=0;
food_pages =0;
food_end_page = 0;
isBtnFoodVisible = true;
isBtnFoodBackVisible = false;

gas_start = 1;
gas_limit = 4;
total_gas=0;
gas_pages =0;
gas_end_page = 0;
isBtnGasVisible = true;
isBtnGasBackVisible = false;

meat_start = 1;
meat_limit = 4;
total_meat=0;
meat_pages =0;
meat_end_page = 0;
isBtnMeatVisible = true;
isBtnMeatBackVisible = false;

restaurants: any;
slides!: any[][];
filteredSlides!: any[][];
currentIndex = 0;
private autoPlaySubscription!: Subscription;
private autoPlaySubscription1!: Subscription;
isMobile!: boolean;
searchTerm: string = '';
searchResto: any;

genMenu: any;
slides1!: any[][];
filteredSlides1!: any[][];
currentIndex1 = 0;
selectedCat: any;

popularProducts: any;

  constructor(private productService: ProductService,
              private  cartService: CartService,
              private router: Router,
              private matDialog: MatDialog) { 
                localStorage.setItem('f_start',this.food_start.toString())
                localStorage.setItem('f_limit',this.food_limit.toString())

                localStorage.setItem('gas_start',this.gas_start.toString())
                localStorage.setItem('gas_limit',this.gas_limit.toString())

                localStorage.setItem('meat_start',this.meat_start.toString())
                localStorage.setItem('meat_limit',this.meat_limit.toString())
              }

  ngOnInit(): void {
    this.populateData();
    this.getFastFoods(this.food_start,this.food_limit);
    this.getCookingGas(this.gas_start,this.gas_limit);
    this.getMeat(this.meat_start,this.meat_limit);
    this.getAllRestaurants();
    this.filteredSlides = this.slides;
    this.startAutoPlay();
    this.startAutoPlay1();
  }

  ngOnDestroy() {
    if (this.autoPlaySubscription) {
      this.autoPlaySubscription.unsubscribe();
    }

    if (this.autoPlaySubscription1) {
      this.autoPlaySubscription1.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    this.prepareSlides();
    this.prepareSlides1();
  }

  jointSearch(event: any){
    this.searchResto = event.target.value;
    this.productService.searchRestaurant(this.searchResto).subscribe((res: any) =>{
    this.restaurants = res.restaurants;
     
    this.checkScreenSize();
    this.prepareSlides();
    this.startAutoPlay();
    })
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  openMyMenu() {
    this.trigger.toggleMenu();
  } 

  populateData(){
    //-------------------------------------popular products
    this.productService.getPopularProducts().subscribe((res: any) =>{
      this.popularProducts = res.products;

      console.log(this.popularProducts)
    })
    //---------------------------------general menu
    this.productService.getGeneralMenu().subscribe((res: any) =>{
      this.genMenu = res.gen;

    this.checkScreenSize();
    this.prepareSlides1();
    this.startAutoPlay1();
    })
 
    this.productService.getCategoryFromGeneral(1).subscribe((cat: ServerResponse) => {
      this.category = cat.cats;
    });

   //.....................fast food paging
   this.productService.getCategoryAnyDetailsNoPaging(1).subscribe((prod: ServerResponse) =>{
    this.total_food = prod.products.length;
    this.food_pages = this.total_food/this.food_limit;
    
    this.food_end_page = this.food_limit*Math.trunc(this.food_pages);
 })

   //......................cooking gas paging
   this.productService.getCategoryAnyDetailsNoPaging(2).subscribe((prod: ServerResponse) =>{
    this.total_gas = prod.products.length;
    this.gas_pages = this.total_gas/this.gas_limit;
    
    this.gas_end_page = this.gas_limit*Math.trunc(this.gas_pages);
 })

 //......................Meat paging
 this.productService.getCategoryAnyDetailsNoPaging(6).subscribe((prod: ServerResponse) =>{
  this.total_meat = prod.products.length;
  this.meat_pages = this.total_meat/this.meat_limit;
  
  this.meat_end_page = this.meat_limit*Math.trunc(this.meat_pages);
})
 

  }

  prepareSlides() {
    this.slides = [];
    const itemsPerSlide = this.isMobile ? 2 : 5;
    for (let i = 0; i < this.restaurants.length; i += itemsPerSlide) {
      this.slides.push(this.restaurants.slice(i, i + itemsPerSlide));
    }
  }

  prepareSlides1() {
    this.slides1 = [];
    const itemsPerSlide = this.isMobile ? 2 : 5;
    for (let i = 0; i < this.genMenu.length; i += itemsPerSlide) {
      this.slides1.push(this.genMenu.slice(i, i + itemsPerSlide));
    }
  }

  startAutoPlay() {
    this.autoPlaySubscription = interval(30000).subscribe(() => {
      this.nextSlide();
    });
  }

  startAutoPlay1() {
    this.autoPlaySubscription1 = interval(25000).subscribe(() => {
      this.nextSlide1();
    });
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.tabGroup.selectedIndex = this.currentIndex;
  }

  backSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.tabGroup.selectedIndex = this.currentIndex;
  }

  nextSlide1() {
    this.currentIndex1 = (this.currentIndex1 + 1) % this.slides1.length;
    this.tabGroup1.selectedIndex = this.currentIndex1;
  }

  backSlide1() {
    this.currentIndex1 = (this.currentIndex1 + 1) % this.slides1.length;
    this.tabGroup1.selectedIndex = this.currentIndex1;
  }

  qwick_view_product(prod_id: any){
    const dialogRef = this.matDialog.open(ProductQuickViewComponent,{
      data: {prod_id: prod_id}
    })
  }

  getAllRestaurants(){
    this.productService.getAllRestaurants().subscribe((res: any) =>{
      this.restaurants = res.restaurants;
     console.log(this.restaurants)
    this.checkScreenSize();
    this.prepareSlides();
    this.startAutoPlay();
    })

  }

  getCategorySubmenu(id: any){
    this.productService.getMenuFromCategory(id).subscribe((cat: ServerResponse) => {
      this.catMenu = cat.products;
    });
  }
  
  getFastFoods(food_start: number, food_limit: any){
   this.productService.getCategoryAnyDetails(1,food_start,food_limit).subscribe((prod: ServerResponse) =>{
      this.foods = prod.products;
   })
  }

  getCookingGas(gas_start: number, gas_limit: any){
    this.productService.getCategoryAnyDetails(2,gas_start,gas_limit).subscribe((prod: ServerResponse) =>{
       this.cookingGas = prod.products;
    })
   }

   getMeat(meat_start: number, meat_limit: any){
    this.productService.getCategoryAnyDetails(6,meat_start,meat_limit).subscribe((prod: ServerResponse) =>{
       this.allMeat = prod.products;
    })
   }

   openResto(restoId: any, restoName: any, restoImage: any){
    const dialogRef = this.matDialog.open(CategoryComponent, {
      data: {restoId:restoId,restoName: restoName,restoImage: restoImage}
    });
   }

  menuSelected(value: any) {
    this.selectedCat = value
    var cate = '';
    if(this.selectedCat == 1) { cate = 'Fast Food & Beverages'}
    if(this.selectedCat == 2) { cate = 'Cooking Gas Refilling'}
    if(this.selectedCat == 7) { cate = 'Cake & Confectionaries'}
    if(this.selectedCat == 6) { cate = 'Meat & Meat Products'}
    if(this.selectedCat == 4) { cate = 'Groceries'}
    if(this.selectedCat == 5) { cate = 'Liquor & Energy Drinks'}
    if(this.selectedCat == 3) { cate = 'Supermarket Shopping'}
    if(this.selectedCat == 8) { cate = 'Parcels Pickup'}
    if(this.selectedCat == 9) { cate = 'Dry Cleaning Garment'}
    if(this.selectedCat == 10) { cate = 'Medicine Pickup'}
    
    this.selectCategory(this.selectedCat,cate);

}

  food_next_page(){
    this.isBtnFoodBackVisible = true;
    const start = Number(localStorage.getItem('f_start'));
    const limit = Number(localStorage.getItem('f_limit'));

    const new_start = limit;
    const new_limit = new_start+this.food_limit;
   
   if(new_start === this.food_end_page){
    this.isBtnFoodVisible = false;
   }

   this.getFastFoods(new_start,this.food_limit);

    localStorage.setItem('f_start',new_start.toString())
    localStorage.setItem('f_limit',new_limit.toString())
  }

  food_back_page(){
    this.isBtnFoodVisible = true;
    const start = Number(localStorage.getItem('f_start'));
    const limit = Number(localStorage.getItem('f_limit'));

    const new_start = limit;
    const new_limit = new_start-this.food_limit;
   
   if(new_start === 1 || new_start === 0){
    this.isBtnFoodBackVisible = false;
   }

   this.getFastFoods(new_start,this.food_limit);

    localStorage.setItem('f_start',new_start.toString())
    localStorage.setItem('f_limit',new_limit.toString())
  }

  gas_next_page(){
    this.isBtnGasBackVisible = true;
    const start = Number(localStorage.getItem('gas_start'));
    const limit = Number(localStorage.getItem('gas_limit'));

    const new_start = limit;
    const new_limit = new_start+this.gas_limit;
   
   if(new_start === this.gas_end_page){
    this.isBtnGasVisible = false;
   }

   this.getCookingGas(new_start,this.gas_limit);

    localStorage.setItem('gas_start',new_start.toString())
    localStorage.setItem('gas_limit',new_limit.toString())
  }

  gas_back_page(){
    this.isBtnGasVisible = true;
    const start = Number(localStorage.getItem('gas_start'));
    const limit = Number(localStorage.getItem('gas_limit'));

    const new_start = limit;
    const new_limit = new_start-this.gas_limit;
   
   if(new_start === 1 || new_start === 0){
    this.isBtnGasBackVisible = false;
   }

   this.getCookingGas(new_start,this.gas_limit);

    localStorage.setItem('gas_start',new_start.toString())
    localStorage.setItem('gas_limit',new_limit.toString())
  }
 
  meat_next_page(){
    this.isBtnMeatBackVisible = true;
    const start = Number(localStorage.getItem('meat_start'));
    const limit = Number(localStorage.getItem('meat_limit'));

    const new_start = limit;
    const new_limit = new_start+this.meat_limit;
   
   if(new_start === this.meat_end_page){
    this.isBtnMeatVisible = false;
   }

   this.getMeat(new_start,this.meat_limit);

    localStorage.setItem('meat_start',new_start.toString())
    localStorage.setItem('meat_limit',new_limit.toString())
  }

  meat_back_page(){
    this.isBtnMeatVisible = true;
    const start = Number(localStorage.getItem('meat_start'));
    const limit = Number(localStorage.getItem('meat_limit'));

    const new_start = limit;
    const new_limit = new_start-this.meat_limit;
    
    this.getMeat(new_start,this.meat_limit);

   if(new_start === 1 || new_start === 0){
    this.isBtnMeatBackVisible = false;
   }

    localStorage.setItem('meat_start',new_start.toString())
    localStorage.setItem('meat_limit',new_limit.toString())
  }



  // tslint:disable-next-line:typedef
  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  // tslint:disable-next-line:typedef
  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }
  // tslint:disable-next-line:typedef
  selectCategory(cat_id:any,catName: any) {
    this.router.navigate(['/categories-view/'+cat_id+'/'+catName]).then();
  }

}
