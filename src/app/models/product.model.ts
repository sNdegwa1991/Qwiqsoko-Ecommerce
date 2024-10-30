export interface ProductModelServer {
    id: number;
    sub_menu: string;
    category: string;
    menu: string;
    price: number;
    image: string;
    availability: number;
    restaurant: string;
    restoId: number;
    coordinates: string;
    images: string;
    cat_id: number;
    cat_name: any;
    cat_image: any;

  }

  export interface ServerResponse {
    count: number;
    cats: ProductModelServer[];
    products: ProductModelServer[];
  }
  