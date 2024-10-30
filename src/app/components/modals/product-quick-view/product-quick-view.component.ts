import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { environment } from 'src/environments/environment';

declare let $: any;
@Component({
  selector: 'app-product-quick-view',
  templateUrl: './product-quick-view.component.html',
  styleUrls: ['./product-quick-view.component.scss']
})
export class ProductQuickViewComponent {

  prod_id: any;
  product: any;
  thumbimages: any[] = [];
  @ViewChild('quantity') quantityInput: any;
  img_url = environment.IMG_URL;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {prod_id: any},
  private productService: ProductService,
  private cartService: CartService,
  private route: ActivatedRoute){
   this.prod_id = data.prod_id;
   this.getProductDetails();
  }

  ngOnInit(): void {

  }

  getProductDetails(){
    this.productService.getSingleProduct(this.prod_id).subscribe(prod => {
      this.product = prod;
      if (prod.image !== null) {
        this.thumbimages = prod.image.split(';');
      }

    });
  }

  ngAfterViewInit(): void {

    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  // tslint:disable-next-line:typedef
  Increase() {
    // tslint:disable-next-line:radix
    let value = parseInt(this.quantityInput.nativeElement.value);
   // if (this.product.quantity >= 1) {
      value++;
      
    this.quantityInput.nativeElement.value = value.toString();

  }

  // tslint:disable-next-line:typedef
  Decrease() {
    // tslint:disable-next-line:radix
    let value = parseInt(this.quantityInput.nativeElement.value);
    //if (this.product.quantity > 0) {
      value--;
      if (value <= 1) {
        value = 1;
      }
    // } else {
    //   return;
    // }
    this.quantityInput.nativeElement.value = value.toString();


  }

   // tslint:disable-next-line:typedef
   addToCart(id: number) {
    this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);

  }

}
