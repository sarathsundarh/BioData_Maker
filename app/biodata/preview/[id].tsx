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

interface Template {
  id: string;
  name: string;
  isPaid: boolean;
  price?: number;
  backgroundColor: string;
  borderColor: string;
  icon: string;
}

const templates: Template[] = [
  {
    id: 'template1',
    name: 'Classic',
    isPaid: false,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    icon: 'document-text',
  },
  {
    id: 'template2',
    name: 'Floral',
    isPaid: true,
    price: 99,
    backgroundColor: '#F8F4FF',
    borderColor: '#9C6ADE',
    icon: 'flower',
  },
  {
    id: 'template3',
    name: 'Modern',
    isPaid: true,
    price: 149,
    backgroundColor: '#F0F9FF',
    borderColor: '#0091FF',
    icon: 'trending-up',
  },
];

export default function BiodataPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [isPurchased, setIsPurchased] = useState(false);

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // Reset purchase status when changing templates
    if (template.isPaid) {
      setIsPurchased(false);
    }
  };

  const handlePurchase = () => {
    // In a real app, this would open the Razorpay payment flow
    Alert.alert(
      'Purchase Template',
      `Would you like to purchase the ${selectedTemplate.name} template for ₹${selectedTemplate.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            // Simulate successful payment
            setIsPurchased(true);
            Alert.alert('Success', 'Template purchased successfully!');
          }
        },
      ]
    );
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF/PNG
    Alert.alert('Success', 'Biodata downloaded successfully!');
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
          Preview Biodata
        </ThemedText>
        
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Ionicons name="hourglass-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : biodata ? (
        <>
          <View style={styles.templateSelector}>
            <ThemedText style={styles.templateSelectorTitle}>Choose a Template</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateOption,
                    selectedTemplate.id === template.id && styles.selectedTemplate,
                  ]}
                  onPress={() => handleTemplateSelect(template)}
                >
                  <Ionicons 
                    name={template.icon as any} 
                    size={24} 
                    color={selectedTemplate.id === template.id ? SPOTIFY_GREEN : '#666666'} 
                    style={styles.templateIcon}
                  />
                  <ThemedText 
                    style={[
                      styles.templateName,
                      selectedTemplate.id === template.id && styles.selectedTemplateName
                    ]}
                  >
                    {template.name}
                  </ThemedText>
                  {template.isPaid && (
                    <View style={styles.paidBadge}>
                      <ThemedText style={styles.paidText}>₹{template.price}</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollView}>
            <View 
              style={[
                styles.previewContainer, 
                { 
                  backgroundColor: selectedTemplate.backgroundColor,
                  borderColor: selectedTemplate.borderColor,
                }
              ]}
            >
              {selectedTemplate.isPaid && !isPurchased && (
                <View style={styles.watermark}>
                  <ThemedText style={styles.watermarkText}>PREVIEW</ThemedText>
                </View>
              )}

              <View style={styles.previewHeader}>
                <ThemedText style={styles.previewTitle}>Biodata</ThemedText>
              </View>

              <View style={styles.previewContent}>
                <View style={styles.previewSection}>
                  {biodata.photoUri ? (
                    <Image 
                      source={{ uri: biodata.photoUri }} 
                      style={styles.photo} 
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="person" size={60} color="#FFFFFF" />
                    </View>
                  )}

                  <View style={styles.personalInfo}>
                    <ThemedText style={styles.previewName}>
                      {`${biodata.salutation} ${biodata.fullName}`}
                    </ThemedText>
                    <ThemedText style={styles.previewDetail}>
                      {`${biodata.occupation}`}
                    </ThemedText>
                    <ThemedText style={styles.previewDetail}>
                      {`${biodata.religion}, ${biodata.caste}`}
                    </ThemedText>
                    <ThemedText style={styles.previewDetail}>
                      {`Born on ${biodata.dateOfBirth} at ${biodata.placeOfBirth}`}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.previewSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="school" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
                    <ThemedText style={styles.sectionTitle}>Education & Career</ThemedText>
                  </View>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Education: </ThemedText>
                    {biodata.education}
                  </ThemedText>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Occupation: </ThemedText>
                    {biodata.occupation}
                  </ThemedText>
                </View>

                <View style={styles.divider} />

                <View style={styles.previewSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="people" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
                    <ThemedText style={styles.sectionTitle}>Family Details</ThemedText>
                  </View>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Father: </ThemedText>
                    {`${biodata.fatherName} (${biodata.fatherOccupation})`}
                  </ThemedText>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Mother: </ThemedText>
                    {`${biodata.motherName} (${biodata.motherOccupation})`}
                  </ThemedText>
                </View>

                <View style={styles.divider} />

                <View style={styles.previewSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="call" size={20} color={SPOTIFY_GREEN} style={styles.sectionIcon} />
                    <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
                  </View>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Phone: </ThemedText>
                    {biodata.phoneNumber}
                  </ThemedText>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Email: </ThemedText>
                    {biodata.email}
                  </ThemedText>
                  <ThemedText style={styles.previewDetail}>
                    <ThemedText style={styles.boldText}>Address: </ThemedText>
                    {biodata.address}
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            {selectedTemplate.isPaid && !isPurchased ? (
              <SpotifyButton
                title={`Purchase Template (₹${selectedTemplate.price})`}
                onPress={handlePurchase}
                icon="cart-outline"
                variant="secondary"
              />
            ) : (
              <SpotifyButton
                title="Download"
                onPress={handleDownload}
                icon="download-outline"
              />
            )}
          </View>
        </>
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
  templateSelector: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  templateSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: SPOTIFY_DARK,
  },
  templateOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  templateIcon: {
    marginBottom: 8,
  },
  selectedTemplate: {
    borderColor: SPOTIFY_GREEN,
    backgroundColor: 'rgba(29, 185, 84, 0.05)',
  },
  templateName: {
    fontWeight: '600',
    color: '#666666',
  },
  selectedTemplateName: {
    color: SPOTIFY_GREEN,
  },
  paidBadge: {
    backgroundColor: SPOTIFY_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
  },
  paidText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  previewContainer: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  watermarkText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 0.2)',
    transform: [{ rotate: '-45deg' }],
  },
  previewHeader: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(29, 185, 84, 0.05)',
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SPOTIFY_DARK,
  },
  previewContent: {
    padding: 16,
  },
  previewSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  photoPlaceholder: {
    width: 120,
    height: 140,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photo: {
    width: 120,
    height: 140,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  personalInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: SPOTIFY_DARK,
  },
  previewDetail: {
    marginBottom: 8,
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: SPOTIFY_DARK,
  },
  boldText: {
    fontWeight: 'bold',
    color: SPOTIFY_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 16,
  },
  actionButtons: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
}); 