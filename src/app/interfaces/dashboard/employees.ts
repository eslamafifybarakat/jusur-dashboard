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
  id: number | string;
  name: string;
  iqamaImage: string;
  healthCertificate: string;
  expiryDate: string;
  identity: string;
  createdAt: string;
  updatedAt: string;
  clientHistory_id: number;
}

