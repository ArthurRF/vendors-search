export interface IVendor {
  id: number;
  name: string;
  serviceCategories: { id: number; compliant: boolean }[];
  locationId: number;
}
