import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createBiodata } from '@/services/biodataService';

export default function NewBiodataScreen() {
  const insets = useSafeAreaInsets();
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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await createBiodata({
        ...formData,
        siblings: [],
      });
      router.replace('/');
    } catch (error) {
      console.error('Error saving biodata:', error);
      Alert.alert('Error', 'Failed to save biodata. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to go back? Any unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{
          title: 'New Biodata',
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Ionicons name="close-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.headerButton}
              disabled={loading}
            >
              <ThemedText style={[styles.saveText, loading && styles.disabledText]}>
                {loading ? 'Saving...' : 'Save'}
              </ThemedText>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Personal Information</ThemedText>
          
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={handlePickImage} style={styles.photoContainer}>
              {formData.photoUri ? (
                <Image source={{ uri: formData.photoUri }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={40} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <ThemedText style={styles.photoHint}>Tap to add photo</ThemedText>
          </View>
          
          <View style={styles.field}>
            <ThemedText>Salutation *</ThemedText>
            <View style={styles.salutationContainer}>
              <TouchableOpacity 
                style={[
                  styles.salutationButton, 
                  formData.salutation === 'Mr' && styles.selectedSalutation
                ]}
                onPress={() => handleChange('salutation', 'Mr')}
              >
                <ThemedText 
                  style={formData.salutation === 'Mr' ? styles.selectedSalutationText : undefined}
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
                  style={formData.salutation === 'Ms' ? styles.selectedSalutationText : undefined}
                >
                  Ms
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.field}>
            <ThemedText>Full Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
              placeholder="Enter full name"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Basic Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText>Date of Birth *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange('dateOfBirth', value)}
              placeholder="DD/MM/YYYY"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Place of Birth *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.placeOfBirth}
              onChangeText={(value) => handleChange('placeOfBirth', value)}
              placeholder="Enter place of birth"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Education & Career</ThemedText>
          
          <View style={styles.field}>
            <ThemedText>Education *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.education}
              onChangeText={(value) => handleChange('education', value)}
              placeholder="Enter education details"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Occupation *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.occupation}
              onChangeText={(value) => handleChange('occupation', value)}
              placeholder="Enter occupation"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Religious & Cultural Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText>Religion *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.religion}
              onChangeText={(value) => handleChange('religion', value)}
              placeholder="Enter religion"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Caste *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.caste}
              onChangeText={(value) => handleChange('caste', value)}
              placeholder="Enter caste"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Family Information</ThemedText>
          
          <View style={styles.field}>
            <ThemedText>Father's Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fatherName}
              onChangeText={(value) => handleChange('fatherName', value)}
              placeholder="Enter father's name"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Father's Occupation *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.fatherOccupation}
              onChangeText={(value) => handleChange('fatherOccupation', value)}
              placeholder="Enter father's occupation"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Mother's Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.motherName}
              onChangeText={(value) => handleChange('motherName', value)}
              placeholder="Enter mother's name"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Mother's Occupation *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.motherOccupation}
              onChangeText={(value) => handleChange('motherOccupation', value)}
              placeholder="Enter mother's occupation"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Contact Details</ThemedText>
          
          <View style={styles.field}>
            <ThemedText>Phone Number *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.field}>
            <ThemedText>Email *</ThemedText>
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
            <ThemedText>Address *</ThemedText>
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
      
      <StatusBar style="auto" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  saveText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  photoContainer: {
    marginBottom: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
    color: '#666666',
  },
  field: {
    marginTop: 12,
  },
  salutationContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  salutationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginRight: 12,
  },
  selectedSalutation: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedSalutationText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 