import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { RestoServerResponse } from 'src/app/models/restaurant.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

 // tslint:disable-next-line:typedef
 getAllProducts(page: number): Observable<ServerResponse> {
  return this.http.get<ServerResponse>(this.SERVER_URL + '/get-all-menus.php?page='+page);
}

getProductsFromSubCategory(cat_id: any): Observable<ServerResponse> {
  return this.http.get<ServerResponse>(this.SERVER_URL + '/get-category-menus.php?search='+cat_id);
}
getProductsFromSubMenu(menu_id: any): Observable<ServerResponse> {
  return this.http.get<ServerResponse>(this.SERVER_URL + '/get-menu-subMenu-all-resto.php?search='+menu_id);
}

searchWithinSubMenu(menu_id: any,search: any): Observable<ServerResponse> {
  return this.http.get<ServerResponse>(this.SERVER_URL + '/general-search-within-sub-menu.php?search='+search+'&men_id='+menu_id);
}

/* Get Single product from server */
getSingleProduct(id: number): Observable<ProductModelServer> {
  return  this.http.get<ProductModelServer>(this.SERVER_URL + '/get-single-menu.php?menuid=' + id);
}
// Get details from any general category with paging
getCategoryAnyDetails(id: number,start_point:number,page_limit:number): Observable<ServerResponse> {
  return  this.http.get<ServerResponse>(this.SERVER_URL + '/get-any-paged-category-details.php?cat_id='+id+'&start_point='+start_point+'&elements_per_page='+page_limit);
}

// Get details from any general category with no paging
getCategoryAnyDetailsNoPaging(id: number): Observable<ServerResponse> {
  return  this.http.get<ServerResponse>(this.SERVER_URL + '/get-any-nopage-category-details.php?cat_id='+id);
}

// Get categories from any general category
getCategoryFromGeneral(id: number): Observable<ServerResponse> {
  return  this.http.get<ServerResponse>(this.SERVER_URL + '/get-categories.php?prods='+id);
}

// Get menu from any category category
getMenuFromCategory(id: number): Observable<ServerResponse> {
  return  this.http.get<ServerResponse>(this.SERVER_URL + '/get-menu.php?search='+id);
}

getAllRestaurants(): Observable<any>{
  return this.http.get<any>(this.SERVER_URL+'/get-restaurants.php?search=1');
}

getGeneralMenu(): Observable<any>{
  return this.http.get<any>(this.SERVER_URL+'/get-gen-menu.php');
}

searchRestaurant(search:any): Observable<any>{
  return this.http.get<any>(this.SERVER_URL+'/general-search-restaurant.php?resto_status=1&search='+search);
}

// General searching with paging
generalSearchingWithPaging(search: any,start_point:number,page_limit:number): Observable<ServerResponse> {
  return  this.http.get<ServerResponse>(this.SERVER_URL + '/general-search-paged.php?search='+search+'&start_point='+start_point+'&elements_per_page='+page_limit);
}

//.......................................from previous
/*Get products from one category*/
getProductFromCategory(catName: string): Observable<ProductModelServer[]> {
  return  this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products-category.php?cat=' + catName);
}

// Get filtered categories

getFilteredCategories(cat: string) {
  return this.http.get(this.SERVER_URL + '/filter-categories.php?cat=' + cat);
}

// Get filtered sub categories
getFilteredSubCategories(id: number) {
  return this.http.get(this.SERVER_URL + '/filtered-subcategories.php?id=' +id)
}

//Count products
productCount(){
  return this.http.get(this.SERVER_URL+'/products-counter.php')
}

getReviewProposal(order: any){
  return this.http.get(this.SERVER_URL+'/get-order-review-proposals.php?order='+order);
  } 

  getARestaurantsMenus(id: number): Observable<any>{
    return this.http.get<any>(this.SERVER_URL+'/get-restaurant-products.php?search='+id);
  }

  generalSearchWithinResto(restoId: any,search: any): Observable<any>{
    return this.http.get<any>(this.SERVER_URL+'/general-search-within-resto.php?search='+search+'&resto_id='+restoId);
  }

  getPopularProducts(){
    return this.http.get(this.SERVER_URL+'/get-prioritized-deals.php');
    } 

    getRestoMenuCategories(prods: any,restoId: any) {
      return this.http.get(this.SERVER_URL+'/get-restaurant-categories.php?prods='+prods+'&restoId='+restoId);
    } 
    
    getRestoMenu(cat_id: any,restoId: any){
      return this.http.get(this.SERVER_URL+'/get-resto-menu.php?cat_id='+cat_id+'&search='+restoId);
    }
    

    getRestoMenuSubmenu(id: number,restoId: any){
      return this.http.get(this.SERVER_URL+'/get-menu-subMenu.php?search='+id+'&restoId='+restoId);
    }

    searchWithinMenu(product: any,men_id: any,restoId: any){
      return this.http.get(this.SERVER_URL+'/general-search-within-sub-menu-resto.php?search='+product+'&men_id='+men_id+'&resto_id='+restoId);
      } 

}
