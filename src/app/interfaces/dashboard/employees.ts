//Listing
export interface EmployeesListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    items: EmployeesListingItem[];
  };
}
export interface EmployeesListingItem {
  id?: number;
  fullName: string | null;
  residencyNumber: string;
  endDate: Date | null;
  healthCertificate: string;
  residencePhoto: string;
}
