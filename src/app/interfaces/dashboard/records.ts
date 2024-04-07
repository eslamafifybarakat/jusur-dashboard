//Listing
export interface RecordsListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: RecordsListingItem[];
  };
}
export interface RecordsListingItem {
  id?: string;
  recordName: string | null;
  recordNumber: string;
  endDate: Date | null;
}
