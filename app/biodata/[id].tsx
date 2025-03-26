import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SpotifyButton } from '@/components/SpotifyButton';
import { Biodata } from '@/models/biodata';
import { getBiodataById } from '@/services/biodataService';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';
const SPOTIFY_DARK = '#191414';

export default function BiodataViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBiodata(id);
    }
  }, [id]);

  const loadBiodata = async (biodataId: string) => {
    setLoading(true);
    try {
      const data = await getBiodataById(biodataId);
      setBiodata(data);
    } catch (error) {
      console.error('Error loading biodata:', error);
      Alert.alert('Error', 'Failed to load biodata details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      router.push({
        pathname: "/biodata/edit/[id]",
        params: { id }
      });
    }
  };

  const handlePreview = () => {
    if (id) {
      router.push({
        pathname: "/biodata/preview/[id]",
        params: { id }
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBackground} />
      
      {/* Custom Header */}
      <View style={styles.header}>
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
          Biodata Details
        </ThemedText>
        
        <TouchableOpacity 
          onPress={handleEdit} 
          style={styles.editButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="pencil" 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Ionicons name="hourglass-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : biodata ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            {biodata.photoUri ? (
              <Image source={{ uri: biodata.photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <ThemedText style={styles.photoPlaceholderText}>
                  {biodata.fullName.charAt(0)}
                </ThemedText>
              </View>
            )}
            <ThemedText style={styles.name}>{`${biodata.salutation} ${biodata.fullName}`}</ThemedText>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Name:</ThemedText>
              <ThemedText style={styles.value}>{`${biodata.salutation} ${biodata.fullName}`}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Date of Birth:</ThemedText>
              <ThemedText style={styles.value}>{biodata.dateOfBirth}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Place of Birth:</ThemedText>
              <ThemedText style={styles.value}>{biodata.placeOfBirth}</ThemedText>
            </View>
            {biodata.height && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Height:</ThemedText>
                <ThemedText style={styles.value}>{biodata.height}</ThemedText>
              </View>
            )}
            {biodata.weight && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Weight:</ThemedText>
                <ThemedText style={styles.value}>{biodata.weight}</ThemedText>
              </View>
            )}
          </View>

          {/* Education & Career */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="school" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Education & Career</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Education:</ThemedText>
              <ThemedText style={styles.value}>{biodata.education}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Occupation:</ThemedText>
              <ThemedText style={styles.value}>{biodata.occupation}</ThemedText>
            </View>
            {biodata.annualIncome && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Annual Income:</ThemedText>
                <ThemedText style={styles.value}>{biodata.annualIncome}</ThemedText>
              </View>
            )}
          </View>

          {/* Religious & Cultural Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Religious & Cultural Details</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Religion:</ThemedText>
              <ThemedText style={styles.value}>{biodata.religion}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Caste:</ThemedText>
              <ThemedText style={styles.value}>{biodata.caste}</ThemedText>
            </View>
            {biodata.gotra && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Gotra:</ThemedText>
                <ThemedText style={styles.value}>{biodata.gotra}</ThemedText>
              </View>
            )}
            {biodata.raasi && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Raasi:</ThemedText>
                <ThemedText style={styles.value}>{biodata.raasi}</ThemedText>
              </View>
            )}
            {biodata.nakshatra && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.label}>Nakshatra:</ThemedText>
                <ThemedText style={styles.value}>{biodata.nakshatra}</ThemedText>
              </View>
            )}
          </View>

          {/* Family Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Family Information</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Father's Name:</ThemedText>
              <ThemedText style={styles.value}>{biodata.fatherName}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Father's Occupation:</ThemedText>
              <ThemedText style={styles.value}>{biodata.fatherOccupation}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Mother's Name:</ThemedText>
              <ThemedText style={styles.value}>{biodata.motherName}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Mother's Occupation:</ThemedText>
              <ThemedText style={styles.value}>{biodata.motherOccupation}</ThemedText>
            </View>
            
            {biodata.siblings.length > 0 && (
              <>
                <ThemedText style={styles.subheading}>Siblings:</ThemedText>
                {biodata.siblings.map((sibling, index) => (
                  <View key={sibling.id} style={styles.siblingContainer}>
                    <ThemedText style={styles.siblingName}>{`${index + 1}. ${sibling.name}`}</ThemedText>
                    <ThemedText style={styles.siblingDetails}>{`${sibling.gender}, ${sibling.age || 'N/A'}, ${sibling.maritalStatus}`}</ThemedText>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Contact Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
              <ThemedText style={styles.sectionTitle}>Contact Details</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Phone Number:</ThemedText>
              <ThemedText style={styles.value}>{biodata.phoneNumber}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Email:</ThemedText>
              <ThemedText style={styles.value}>{biodata.email}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Address:</ThemedText>
              <ThemedText style={styles.value}>{biodata.address}</ThemedText>
            </View>
          </View>

          <SpotifyButton
            title="Preview Biodata"
            onPress={handlePreview}
            icon="document-outline"
            style={styles.previewButton}
          />
        </ScrollView>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.notFoundText}>Biodata not found</ThemedText>
        </View>
      )}
      
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
  editButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  photoPlaceholderText: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: SPOTIFY_DARK,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SPOTIFY_DARK,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
    minWidth: 150,
    color: SPOTIFY_DARK,
  },
  value: {
    flex: 1,
    color: '#333333',
  },
  subheading: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: SPOTIFY_DARK,
    fontSize: 16,
  },
  siblingContainer: {
    marginLeft: 16,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
  },
  siblingName: {
    fontWeight: '600',
    color: SPOTIFY_DARK,
    marginBottom: 4,
  },
  siblingDetails: {
    color: '#666666',
  },
  previewButton: {
    marginTop: 16,
    marginBottom: 24,
  },
}); 