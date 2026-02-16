
export interface UserProfile {
  id: string;
  fullName: string;
  age: string;
  bloodGroup: string;
  emergencyContact1Name: string;
  emergencyContact1Phone: string;
  emergencyContact2Name?: string;
  emergencyContact2Phone?: string;
  medicalConditions?: string;
  allergies?: string;
  address: string;
  createdAt: string;
}

export enum AppState {
  HOME = 'HOME',
  REGISTER = 'REGISTER',
  QR_VIEW = 'QR_VIEW',
  SCAN = 'SCAN',
  PROFILE = 'PROFILE'
}
