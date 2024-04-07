// Listings
interface Category {
  id: number;
  icon: string | null;
  name: string | null;
}
interface Gallery {
  id: number;
  file: string;
  type: string;
}
interface Price {
  id: number;
  name: string | null;
}
interface City {
  id: number;
  name: string | null;
}
interface Region {
  id: number;
  name: string | null;
}
interface Rating {
  id: number;
  name: string;
  email: string;
  rateText: string;
  rate: string;
  type: string;
  parent_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}
interface Meta {
  title: string | null;
  description: string | null;
  link: string | null;
  keyWords: string[] | null;
}
export interface PlacesListing {
  id: number;
  slug: string;
  type: string;
  categories: Category[];
  address: string | null;
  image: string;
  ticket_link: string | null;
  website_link: string | null;
  instagram_link: string | null;
  whatsapp: string | null;
  facebook_link: string | null;
  temperature: number | null;
  seasons: string[];
  related_places: any[]; // You can define the type for related_places as needed
  galleries: Gallery[];
  price: Price;
  city: City;
  region: Region;
  address_type: string;
  active: number;
  views_num: number;
  near_stores: any; // You can define the type for near_stores as needed
  featured: boolean;
  lat: number;
  long: number;
  visited: boolean;
  distance: string | null;
  key_words: string[] | null;
  prefered: number;
  place_icon: string | null;
  rate: number;
  review: number;
  title: string | null;
  description: string | null;
  ratings: Rating[];
  meta: Meta | null;
}
export interface PlacesListingApiResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    items: PlacesListing[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
// Details
export interface PlaceApiResponse {
  code: number;
  message: string;
  data: PlaceData;
}
export interface PlaceData {
  id: number;
  slug: string;
  type: string;
  address_name?: string;
  categories: Category[];
  address: string;
  image: string;
  ticket_link: string | null;
  website_link: string | null;
  instagram_link: string | null;
  whatsapp: string | null;
  facebook_link: string | null;
  temperature: number;
  seasons: string[];
  related_places: any[]; // Assuming this could be a similar structure to PlaceData or another known interface
  galleries: Gallery[];
  price: Price;
  city: City;
  region: Region;
  address_type: string;
  active: number;
  views_num: number;
  near_stores: any | null; // Specify further if the structure is known
  featured: boolean;
  lat: number;
  long: number;
  visited: boolean;
  distance: string;
  key_words: any | null; // Specify further if the structure is known
  prefered: number;
  place_icon: string;
  rate: number;
  review: number;
  title: string;
  description: string;
  ratings: any[]; // Specify further if the structure is known
  meta: any | null; // Specify further if the structure is known
}
interface Category {
  id: number;
  icon: string | null;
  name: string | null;
}
interface Gallery {
  id: number;
  file: string;
  type: string;
}
interface Price {
  id: number;
  name: string | null;
}
interface City {
  id: number;
  name: string | null;
}
interface Region {
  id: number;
  name: string | null;
}

//Parent Categories
interface ParentCategory {
  id: number;
  icon: string;
  name: string;
}
export interface ParentCategoriesResponse {
  code: number;
  message: string;
  data: Category[];
}

//Generic Carousel
export interface HeroSliderPlace {
  image: string;
  title?: string;
  subTitle?: string;
  description?: string;
  buttonText?: string;
}
