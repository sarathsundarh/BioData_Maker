export interface Biodata {
  id: string;
  salutation: 'Mr' | 'Ms';
  fullName: string;
  photoUri?: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth: string;
  height?: string;
  weight?: string;
  education: string;
  occupation: string;
  annualIncome?: string;
  religion: string;
  caste: string;
  gotra?: string;
  raasi?: string;
  nakshatra?: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: Sibling[];
  phoneNumber: string;
  email: string;
  address: string;
  createdAt: number;
  updatedAt: number;
}

export interface Sibling {
  id: string;
  name: string;
  age?: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
}

export interface BiodataPreview {
  id: string;
  name: string;
  description: string;
  photoUri?: string;
}

// Mock data for development
export const mockBiodata: BiodataPreview[] = [
  {
    id: '1',
    name: 'Ms Divya GM',
    description: 'Software Engineer, Hindu, Bangalore',
    photoUri: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Mr Rahul Sharma',
    description: 'Doctor, Hindu, Mumbai',
    photoUri: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Ms Priya Patel',
    description: 'Architect, Jain, Ahmedabad',
    photoUri: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '4',
    name: 'Mr Arjun Reddy',
    description: 'Business Analyst, Hindu, Hyderabad',
    photoUri: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
]; 