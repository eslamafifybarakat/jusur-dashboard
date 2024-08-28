//Listing
export interface EmployeesListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: string;
    perPage: number;
    items: EmployeesListingItem[];
  };
}

export interface EmployeesListingItem {
  id: number | string | null;
  name: string | null;
  iqamaImage: string | null;
  healthCertificate: string | null;
  expiryDate: string | null;
  identity: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  clientHistory_id: number | null;
  active?: boolean;
  isLoadingActive?: boolean;
  contractImage?: string | null;
}

