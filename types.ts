export interface Refugee {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  shelterName: string;
  familySize: number;
  medicalNeeds: string;
  registrationDate: string;
  status: string;
}

export interface DashboardStats {
  totalRefugees: number;
  genderDistribution: { name: string; value: number }[];
  shelterDistribution: { name: string; value: number }[];
  urgentMedicalCases: number;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  REGISTER = 'register',
  LIST = 'list'
}