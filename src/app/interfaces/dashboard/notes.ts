//Listing
export interface NotesListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    items: NotesListingItem[];
  };
}
export interface NotesListingItem {
  id: number;
  desc: string;
  createdAt ?: string | Date | null;
  updatedAt?: string | Date | null;
}

