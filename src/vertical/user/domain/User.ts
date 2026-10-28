export enum Type {
  DNI = "dni",
  CIF = "cif",
  PASSPORT = "passport",
  NIE = "nie",
}

export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  identityDocType: string;
  identityDocNumber: string;
  companyName: string;
  phoneNumber: string;
  birthDate: string;
  address: string;
  city: string;
  zipCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserFormData = Omit<User, never>;