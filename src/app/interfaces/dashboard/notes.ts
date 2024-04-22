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
  description: string;
  date: string | Date | null;
}

