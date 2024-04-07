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

export interface DoctorsListing {
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

export interface DoctorsListingApiResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    items: DoctorsListing[];
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
