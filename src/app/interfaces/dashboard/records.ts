//Listing
export interface RecordsListApiResponse {
  success: boolean;
  result: {
    totalCount: number;
    items: RecordsListingItem[];
  };
}
export interface RecordsListingItem {
  id: number;
  name: string;
  number: string;
  expireDate: string | Date | null;
  active: boolean;
  licenseNumber: string | null;
  licenseDate: string | null;
  certificateNumber: string | null;
  certificateDate: string | null;
  medicalInsuranceNumber: string | null;
  medicalInsuranceDate: string | null;
  businessLicenseNumber: string | null;
  businessLicense: string | null;
  registrationFile: string | null;
  licenseFile: string | null;
  certificateFile: string | null;
  createdAt: string;
  updatedAt: string;
  client_id: number;
}

