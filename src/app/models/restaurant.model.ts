export interface RestoModelServer {
    id: number,
    name: string,
    location: string,
    coordinates: string,
    contact_person: string,
    contact_phone: string,
    image: string,
    restaurant: string,
    category: string ,
    menu: string,
    sub_menu: string,
    price: number,
    restoId: number,
}

export interface RestoServerResponse {
    restaurants: RestoModelServer[];
    products: RestoModelServer[];
  }
  