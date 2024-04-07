//Listing
export interface ClientsListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: ClientListingItem[];
  };
}
export interface ClientListingItem {
  id: number | string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  identity: string;
  birthDate: string | Date | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  company_id: number | null;
  admin_id: number;
  clientHistories: any[];
}
