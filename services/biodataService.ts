import AsyncStorage from '@react-native-async-storage/async-storage';
import { Biodata, BiodataPreview, mockBiodata } from '../models/biodata';

const STORAGE_KEY = 'biodata_entries';

// Initialize with mock data for development
const initializeStorage = async () => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      // For now, we're just storing the preview data
      // In a real app, we would store full biodata objects
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockBiodata));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all biodata previews
export const getAllBiodataPreviews = async (): Promise<BiodataPreview[]> => {
  try {
    await initializeStorage();
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting biodata previews:', error);
    return [];
  }
};

// Get a single biodata by ID
export const getBiodataById = async (id: string): Promise<Biodata | null> => {
  try {
    // In a real app, we would fetch the full biodata object
    // For now, we'll return a mock biodata object based on the preview data
    const previews = await getAllBiodataPreviews();
    const preview = previews.find(item => item.id === id);
    
    if (!preview) return null;
    
    // Create a mock full biodata object from the preview
    const mockFullBiodata: Biodata = {
      id: preview.id,
      salutation: preview.name.startsWith('Mr') ? 'Mr' : 'Ms',
      fullName: preview.name.substring(3), // Remove "Mr " or "Ms " prefix
      photoUri: preview.photoUri,
      dateOfBirth: '01/01/1990',
      placeOfBirth: preview.description.split(', ')[2], // Extract location
      education: 'Bachelor\'s Degree',
      occupation: preview.description.split(', ')[0], // Extract occupation
      religion: preview.description.split(', ')[1], // Extract religion
      caste: 'General',
      fatherName: 'John Doe',
      fatherOccupation: 'Business',
      motherName: 'Jane Doe',
      motherOccupation: 'Homemaker',
      siblings: [],
      phoneNumber: '9876543210',
      email: `${preview.name.substring(3).toLowerCase().replace(' ', '.')}@example.com`,
      address: `123 Main Street, ${preview.description.split(', ')[2]}`, // Use location from description
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    return mockFullBiodata;
  } catch (error) {
    console.error('Error getting biodata by ID:', error);
    return null;
  }
};

// Create a new biodata
export const createBiodata = async (biodata: Omit<Biodata, 'id' | 'createdAt' | 'updatedAt'>): Promise<BiodataPreview> => {
  try {
    const allBiodata = await getAllBiodataPreviews();
    
    const newBiodata: BiodataPreview = {
      id: Date.now().toString(),
      name: `${biodata.salutation} ${biodata.fullName}`,
      description: `${biodata.occupation}, ${biodata.religion}, ${biodata.placeOfBirth}`,
      photoUri: biodata.photoUri,
    };
    
    const updatedBiodata = [...allBiodata, newBiodata];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBiodata));
    
    return newBiodata;
  } catch (error) {
    console.error('Error creating biodata:', error);
    throw error;
  }
};

// Update an existing biodata
export const updateBiodata = async (id: string, biodata: Omit<Biodata, 'id' | 'createdAt' | 'updatedAt'>): Promise<BiodataPreview> => {
  try {
    const allBiodata = await getAllBiodataPreviews();
    
    const updatedPreview: BiodataPreview = {
      id,
      name: `${biodata.salutation} ${biodata.fullName}`,
      description: `${biodata.occupation}, ${biodata.religion}, ${biodata.placeOfBirth}`,
      photoUri: biodata.photoUri,
    };
    
    const updatedBiodata = allBiodata.map(item => 
      item.id === id ? updatedPreview : item
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBiodata));
    
    return updatedPreview;
  } catch (error) {
    console.error('Error updating biodata:', error);
    throw error;
  }
};

// Delete a biodata
export const deleteBiodata = async (id: string): Promise<void> => {
  try {
    const allBiodata = await getAllBiodataPreviews();
    const filteredBiodata = allBiodata.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBiodata));
  } catch (error) {
    console.error('Error deleting biodata:', error);
    throw error;
  }
}; 