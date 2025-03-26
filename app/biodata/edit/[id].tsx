import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SpotifyButton } from '@/components/SpotifyButton';
import { Biodata } from '@/models/biodata';
import { getBiodataById, updateBiodata } from '@/services/biodataService';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';
const SPOTIFY_DARK = '#191414';

export default function EditBiodataScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [originalBiodata, setOriginalBiodata] = useState<Biodata | null>(null);
  const [formData, setFormData] = useState({
    salutation: 'Mr' as 'Mr' | 'Ms',
    fullName: '',
    photoUri: '',
    dateOfBirth: '',
    placeOfBirth: '',
    education: '',
    occupation: '',
    religion: '',
    caste: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (id) {
      loadBiodata(id);
    }
  }, [id]);

  const loadBiodata = async (biodataId: string) => {
    setLoading(true);
    try {
      const data = await getBiodataById(biodataId);
      setOriginalBiodata(data);
      
      if (data) {
        setFormData({
          salutation: data.salutation,
          fullName: data.fullName,
          photoUri: data.photoUri || '',
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          education: data.education,
          occupation: data.occupation,
          religion: data.religion,
          caste: data.caste,
          fatherName: data.fatherName,
          fatherOccupation: data.fatherOccupation,
          motherName: data.motherName,
          motherOccupation: data.motherOccupation,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
        });
      }
    } catch (error) {
      console.error('Error loading biodata:', error);
      Alert.alert('Error', 'Failed to load biodata details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData(prev => ({ ...prev, photoUri: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.fullName || !formData.dateOfBirth || !formData.placeOfBirth || 
        !formData.fatherName || !formData.motherName || !formData.phoneNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Biodata ID is missing');
      return;
    }

    setSaving(true);
    try {
      await updateBiodata(id, {
        ...formData,
        siblings: originalBiodata?.siblings || [],
      });
      router.replace({
        pathname: "/biodata/[id]",
        params: { id }
      });
    } catch (error) {
      console.error('Error updating biodata:', error);
      Alert.alert('Error', 'Failed to update biodata. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to go back? Any unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.headerBackground} />
        <View style={styles.centerContainer}>
          <Ionicons name="hourglass-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!originalBiodata) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.headerBackground} />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.notFoundText}>Biodata not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerBackground} />
      
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>
          Edit Biodata
        </ThemedText>
        
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.saveButton}
          activeOpacity={0.7}
          disabled={saving}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ThemedText style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, activeSection === 0 && styles.activeProgressStep]} />
        <View style={[styles.progressStep, activeSection === 1 && styles.activeProgressStep]} />
        <View style={[styles.progressStep, activeSection === 2 && styles.activeProgressStep]} />
        <View style={[styles.progressStep, activeSection === 3 && styles.activeProgressStep]} />
        <View style={[styles.progressStep, activeSection === 4 && styles.activeProgressStep]} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          // Determine which section is currently visible based on scroll position
          if (scrollY < 200) {
            setActiveSection(0); // Photo section
          } else if (scrollY < 600) {
            setActiveSection(1); // Personal Information
          } else if (scrollY < 900) {
            setActiveSection(2); // Basic Details & Education
          } else if (scrollY < 1300) {
            setActiveSection(3); // Family Details
          } else {
            setActiveSection(4); // Contact Information
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.photoContainer}>
            {formData.photoUri ? (
              <Image source={{ uri: formData.photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={44} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          <ThemedText style={styles.photoHint}>Tap to update profile photo</ThemedText>
        </View>
        
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Salutation <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <View style={styles.salutationContainer}>
              <TouchableOpacity 
                style={[
                  styles.salutationButton, 
                  formData.salutation === 'Mr' && styles.selectedSalutation
                ]}
                onPress={() => handleChange('salutation', 'Mr')}
              >
                <ThemedText 
                  style={formData.salutation === 'Mr' ? styles.selectedSalutationText : styles.salutationText}
                >
                  Mr
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.salutationButton, 
                  formData.salutation === 'Ms' && styles.selectedSalutation
                ]}
                onPress={() => handleChange('salutation', 'Ms')}
              >
                <ThemedText 
                  style={formData.salutation === 'Ms' ? styles.selectedSalutationText : styles.salutationText}
                >
                  Ms
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Full Name <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
              placeholder="Enter full name"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Basic Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Date of Birth <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange('dateOfBirth', value)}
              placeholder="DD/MM/YYYY"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Place of Birth <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.placeOfBirth}
              onChangeText={(value) => handleChange('placeOfBirth', value)}
              placeholder="Enter place of birth"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Education & Career</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Education <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.education}
              onChangeText={(value) => handleChange('education', value)}
              placeholder="Enter education details"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Occupation <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.occupation}
              onChangeText={(value) => handleChange('occupation', value)}
              placeholder="Enter occupation"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Religious & Cultural Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Religion <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.religion}
              onChangeText={(value) => handleChange('religion', value)}
              placeholder="Enter religion"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Caste <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.caste}
              onChangeText={(value) => handleChange('caste', value)}
              placeholder="Enter caste"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Family Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Father's Name <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fatherName}
              onChangeText={(value) => handleChange('fatherName', value)}
              placeholder="Enter father's name"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Father's Occupation <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fatherOccupation}
              onChangeText={(value) => handleChange('fatherOccupation', value)}
              placeholder="Enter father's occupation"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Mother's Name <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.motherName}
              onChangeText={(value) => handleChange('motherName', value)}
              placeholder="Enter mother's name"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Mother's Occupation <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.motherOccupation}
              onChangeText={(value) => handleChange('motherOccupation', value)}
              placeholder="Enter mother's occupation"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Phone Number <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Email <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText style={styles.fieldLabel}>
              Address <ThemedText style={styles.requiredField}>*</ThemedText>
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              placeholder="Enter address"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
      
      <StatusBar style="light" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    backgroundColor: SPOTIFY_GREEN,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: SPOTIFY_GREEN,
  },
  notFoundText: {
    marginTop: 16,
    fontSize: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  progressStep: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeProgressStep: {
    backgroundColor: SPOTIFY_GREEN,
    width: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photo: {
    width: 140,
    height: 140,
  },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  formSection: {
    marginBottom: 28,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: SPOTIFY_GREEN,
    borderLeftWidth: 3,
    borderLeftColor: SPOTIFY_GREEN,
    paddingLeft: 10,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontWeight: '500',
    color: SPOTIFY_DARK,
    fontSize: 15,
  },
  requiredField: {
    color: '#FF5252',
    fontWeight: 'bold',
  },
  salutationContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  salutationButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedSalutation: {
    backgroundColor: SPOTIFY_GREEN,
    borderColor: SPOTIFY_GREEN,
  },
  selectedSalutationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  salutationText: {
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 