//Listing
export interface VehiclesListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: VehiclesListingItem[];
  };
}
export interface VehiclesListingItem {
  id?: string;
  workPermitCard: string | null;
  expiryDate: Date | null;
  insuranceExpiryDate: Date | null;
  formImage: string
}
