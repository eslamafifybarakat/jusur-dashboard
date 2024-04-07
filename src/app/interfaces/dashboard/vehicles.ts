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
  operatingCard: string | null;
  endDate: Date | null;
  insuranceExpiryDate: Date | null;
  formPhoto: string
}
