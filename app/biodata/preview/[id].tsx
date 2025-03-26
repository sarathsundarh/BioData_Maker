import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Image, ImageBackground, Dimensions, Share, Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SpotifyButton } from '@/components/SpotifyButton';
import GoogleAdsBanner from '@/components/GoogleAdsBanner';
import { Biodata } from '@/models/biodata';
import { getBiodataById } from '@/services/biodataService';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';
const SPOTIFY_DARK = '#191414';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type TemplateCategory = 'general' | 'hindu' | 'muslim' | 'christian';

interface Template {
  id: string;
  name: string;
  isPaid: boolean;
  price?: number;
  category: TemplateCategory;
  backgroundImage: any; // Changed to 'any' to fix type issue
  icon: string;
}

const templates: Template[] = [
  // Free general templates
  {
    id: 'free1',
    name: 'Basic',
    isPaid: false,
    category: 'general',
    backgroundImage: require('../../../MatriData_Templates/free_template_bg_1.png'),
    icon: 'document-text',
  },
  {
    id: 'free2',
    name: 'Simple',
    isPaid: false,
    category: 'general',
    backgroundImage: require('../../../MatriData_Templates/free_template_bg_2.png'),
    icon: 'document-text',
  },
  
  // General templates
  {
    id: 'general1',
    name: 'Classic',
    isPaid: true,
    price: 99,
    category: 'general',
    backgroundImage: require('../../../MatriData_Templates/general_template_bg_1.png'),
    icon: 'document-text',
  },
  {
    id: 'general2',
    name: 'Modern',
    isPaid: true,
    price: 149,
    category: 'general',
    backgroundImage: require('../../../MatriData_Templates/general_template_bg_2.png'),
    icon: 'trending-up',
  },
  {
    id: 'general3',
    name: 'Elegant',
    isPaid: true,
    price: 179,
    category: 'general',
    backgroundImage: require('../../../MatriData_Templates/general_template_bg_3.png'),
    icon: 'flower',
  },
  
  // Hindu templates
  {
    id: 'hindu1',
    name: 'Traditional',
    isPaid: true,
    price: 129,
    category: 'hindu',
    backgroundImage: require('../../../MatriData_Templates/hindu_template_bg_1.png'),
    icon: 'leaf',
  },
  {
    id: 'hindu2',
    name: 'Auspicious',
    isPaid: true,
    price: 149,
    category: 'hindu',
    backgroundImage: require('../../../MatriData_Templates/hindu_template_bg_2.png'),
    icon: 'flame',
  },
  {
    id: 'hindu3',
    name: 'Celebration',
    isPaid: true,
    price: 169,
    category: 'hindu',
    backgroundImage: require('../../../MatriData_Templates/hindu_template_bg_3.png'),
    icon: 'star',
  },
  
  // Muslim templates
  {
    id: 'muslim1',
    name: 'Elegant',
    isPaid: true,
    price: 129,
    category: 'muslim',
    backgroundImage: require('../../../MatriData_Templates/muslim_template_bg_1.png'),
    icon: 'moon',
  },
  {
    id: 'muslim2',
    name: 'Traditional',
    isPaid: true,
    price: 149,
    category: 'muslim',
    backgroundImage: require('../../../MatriData_Templates/muslim_template_bg_2.png'),
    icon: 'star',
  },
  {
    id: 'muslim3',
    name: 'Heritage',
    isPaid: true,
    price: 169,
    category: 'muslim',
    backgroundImage: require('../../../MatriData_Templates/muslim_template_bg_3.png'),
    icon: 'globe',
  },
  
  // Christian templates
  {
    id: 'christian1',
    name: 'Classic',
    isPaid: true,
    price: 129,
    category: 'christian',
    backgroundImage: require('../../../MatriData_Templates/christian_template_bg_1.png'),
    icon: 'book',
  },
  {
    id: 'christian2',
    name: 'Modern',
    isPaid: true,
    price: 149,
    category: 'christian',
    backgroundImage: require('../../../MatriData_Templates/christian_template_bg_2.png'),
    icon: 'heart',
  },
  {
    id: 'christian3',
    name: 'Divine',
    isPaid: true,
    price: 169,
    category: 'christian',
    backgroundImage: require('../../../MatriData_Templates/christian_template_bg_3.png'),
    icon: 'flower',
  },
];

export default function BiodataPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [biodata, setBiodata] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('general');
  
  useEffect(() => {
    if (id) {
      loadBiodata(id);
    }
  }, [id]);

  // When biodata is loaded, try to set a default template based on religion
  useEffect(() => {
    if (biodata) {
      let religionBasedCategory: TemplateCategory = 'general';
      
      if (biodata.religion.toLowerCase().includes('hindu')) {
        religionBasedCategory = 'hindu';
      } else if (biodata.religion.toLowerCase().includes('muslim') || 
                 biodata.religion.toLowerCase().includes('islam')) {
        religionBasedCategory = 'muslim';
      } else if (biodata.religion.toLowerCase().includes('christian') || 
                 biodata.religion.toLowerCase().includes('catholic')) {
        religionBasedCategory = 'christian';
      }
      
      // Set the category and find a template in that category
      setActiveCategory(religionBasedCategory);
      
      // Find the first template in that category
      const religiousTemplate = templates.find(t => t.category === religionBasedCategory);
      if (religiousTemplate) {
        setSelectedTemplate(religiousTemplate);
      }
    }
  }, [biodata]);

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

  const handleDownloadPDF = async () => {
    // Start the download process
    setDownloading(true);
    
    try {
      // Simulate PDF generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a filename based on the biodata
      const fileName = `${biodata?.fullName.replace(/\s+/g, '_')}_Biodata.pdf`;
      
      // On a real app, this would use a PDF generation library like react-native-html-to-pdf
      // For simulation, we'll create a dummy file in the temporary directory
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      // Simulate writing the PDF file
      // In a real app, this would contain the actual PDF generation code
      await FileSystem.writeAsStringAsync(
        fileUri,
        "This is a simulated PDF file for demo purposes",
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Open the native share dialog
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share Biodata PDF',
          UTI: 'com.adobe.pdf' // iOS only
        });
        
        Alert.alert('Success', 'Your biodata PDF is ready to save or share!');
      } else {
        // Fallback for platforms where sharing is not available
        Alert.alert('Success', `PDF generated successfully!\nFile saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async () => {
    // Start the download process
    setDownloading(true);
    
    try {
      // Simulate PNG generation with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a filename based on the biodata
      const fileName = `${biodata?.fullName.replace(/\s+/g, '_')}_Biodata.png`;
      
      // For simulation, we'll create a dummy file in the temporary directory
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      // Simulate writing the PNG file
      await FileSystem.writeAsStringAsync(
        fileUri,
        "This is a simulated PNG file for demo purposes",
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Open the native share dialog
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: 'Save or Share Biodata Image',
          UTI: 'public.png' // iOS only
        });
        
        Alert.alert('Success', 'Your biodata image is ready to save or share!');
      } else {
        // Fallback for platforms where sharing is not available
        Alert.alert('Success', `Image generated successfully!\nFile saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Error generating PNG:', error);
      Alert.alert('Error', 'Failed to generate PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Filter templates based on active category
  const filteredTemplates = templates.filter(template => template.category === activeCategory);

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
        <View style={styles.mainContent}>
          {/* MAIN PREVIEW SECTION - MOVE TO TOP */}
          <View style={styles.scrollContainer}>
            <View style={styles.previewArea}>
              <ImageBackground 
                source={selectedTemplate.backgroundImage}
                style={styles.previewContainer}
                imageStyle={styles.templateBackground}
              >
                {selectedTemplate.isPaid && !isPurchased && (
                  <View style={styles.watermark}>
                    <ThemedText style={styles.watermarkText}>PREVIEW</ThemedText>
                  </View>
                )}

                <View style={styles.previewContent}>
                  <View style={styles.previewHeader}>
                    <ThemedText style={styles.previewTitle}>Marriage Biodata</ThemedText>
                  </View>
                  
                  <View style={styles.previewSection}>
                    <View style={styles.photoAndDetails}>
                      {biodata.photoUri ? (
                        <Image 
                          source={{ uri: biodata.photoUri }} 
                          style={styles.photo} 
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <Ionicons name="person" size={40} color="#FFFFFF" />
                        </View>
                      )}

                      <View style={styles.personalInfoContainer}>
                        <ThemedText style={styles.previewName}>
                          {`${biodata.salutation} ${biodata.fullName}`}
                        </ThemedText>
                        <ThemedText style={styles.previewDetail}>
                          {`${biodata.occupation}`}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Personal Details Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.sectionHeaderRow}>
                      <ThemedText style={styles.sectionTitle}>Personal Details</ThemedText>
                    </View>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Full Name:</ThemedText>
                        <ThemedText style={styles.detailValue}>{`${biodata.salutation} ${biodata.fullName}`}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Date & Time of Birth:</ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {biodata.timeOfBirth 
                            ? `${biodata.dateOfBirth} at ${biodata.timeOfBirth}`
                            : biodata.dateOfBirth}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Place of Birth:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.placeOfBirth}</ThemedText>
                      </View>
                      
                      {biodata.height && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Height:</ThemedText>
                          <ThemedText style={styles.detailValue}>{biodata.height}</ThemedText>
                        </View>
                      )}
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Religion:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.religion}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Caste:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.caste}</ThemedText>
                      </View>
                      
                      {biodata.gotra && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Gotra:</ThemedText>
                          <ThemedText style={styles.detailValue}>{biodata.gotra}</ThemedText>
                        </View>
                      )}
                      
                      {biodata.raasi && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Rashi/Zodiac:</ThemedText>
                          <ThemedText style={styles.detailValue}>{biodata.raasi}</ThemedText>
                        </View>
                      )}
                      
                      {biodata.nakshatra && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Nakshatra/Star:</ThemedText>
                          <ThemedText style={styles.detailValue}>{biodata.nakshatra}</ThemedText>
                        </View>
                      )}
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Education:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.education}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Occupation:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.occupation}</ThemedText>
                      </View>
                      
                      {biodata.annualIncome && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Annual Income:</ThemedText>
                          <ThemedText style={styles.detailValue}>{biodata.annualIncome}</ThemedText>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Family Details Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.sectionHeaderRow}>
                      <ThemedText style={styles.sectionTitle}>Family Details</ThemedText>
                    </View>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Father's Name:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.fatherName || "Not specified"}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Father's Occupation:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.fatherOccupation || "Not specified"}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Mother's Name:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.motherName || "Not specified"}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Mother's Occupation:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.motherOccupation || "Not specified"}</ThemedText>
                      </View>
                      
                      {Array.isArray(biodata.siblings) && biodata.siblings.length > 0 ? (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Siblings:</ThemedText>
                          <View style={styles.siblingsContainer}>
                            {biodata.siblings.map((sibling, index) => (
                              <ThemedText key={index} style={styles.detailValue}>
                                {`${sibling.name}${sibling.age ? ` (${sibling.age}, ` : ' ('}${sibling.gender}, ${sibling.maritalStatus})`}
                              </ThemedText>
                            ))}
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Contact Details Section */}
                  <View style={styles.previewSection}>
                    <View style={styles.sectionHeaderRow}>
                      <ThemedText style={styles.sectionTitle}>Contact Details</ThemedText>
                    </View>
                    
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Phone:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.phoneNumber}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Email:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.email}</ThemedText>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Address:</ThemedText>
                        <ThemedText style={styles.detailValue}>{biodata.address}</ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* TEMPLATE SELECTION AREA - MOVED TO BOTTOM */}
            <View style={styles.templateArea}>
              {/* Template Category Tabs */}
              <View style={styles.categoryTabs}>
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    activeCategory === 'general' && styles.activeCategoryTab
                  ]}
                  onPress={() => setActiveCategory('general')}
                >
                  <ThemedText style={[
                    styles.categoryTabText,
                    activeCategory === 'general' && styles.activeCategoryTabText
                  ]}>
                    General
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    activeCategory === 'hindu' && styles.activeCategoryTab
                  ]}
                  onPress={() => setActiveCategory('hindu')}
                >
                  <ThemedText style={[
                    styles.categoryTabText,
                    activeCategory === 'hindu' && styles.activeCategoryTabText
                  ]}>
                    Hindu
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    activeCategory === 'muslim' && styles.activeCategoryTab
                  ]}
                  onPress={() => setActiveCategory('muslim')}
                >
                  <ThemedText style={[
                    styles.categoryTabText,
                    activeCategory === 'muslim' && styles.activeCategoryTabText
                  ]}>
                    Muslim
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    activeCategory === 'christian' && styles.activeCategoryTab
                  ]}
                  onPress={() => setActiveCategory('christian')}
                >
                  <ThemedText style={[
                    styles.categoryTabText,
                    activeCategory === 'christian' && styles.activeCategoryTabText
                  ]}>
                    Christian
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Template Selector */}
              <View style={styles.templateSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {filteredTemplates.map((template) => (
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
                        size={20} 
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
            </View>
          </View>

          {/* FIXED ACTION BUTTONS AT BOTTOM */}
          <View style={styles.actionButtonsFixed}>
            {selectedTemplate.isPaid && !isPurchased ? (
              <SpotifyButton
                title={`Purchase Template (₹${selectedTemplate.price})`}
                onPress={handlePurchase}
                icon="cart-outline"
                variant="secondary"
              />
            ) : (
              <View style={styles.downloadOptions}>
                <ThemedText style={styles.downloadTitle}>Download as:</ThemedText>
                <View style={styles.downloadButtons}>
                  <SpotifyButton
                    title="PDF Document"
                    onPress={handleDownloadPDF}
                    icon="document-text-outline"
                    style={styles.downloadButton}
                    disabled={downloading}
                    loading={downloading}
                    size="medium"
                  />
                  <SpotifyButton
                    title="PNG Image"
                    onPress={handleDownloadPNG}
                    icon="image-outline"
                    style={styles.downloadButton}
                    variant="secondary"
                    disabled={downloading}
                    loading={downloading}
                    size="medium"
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.notFoundText}>Biodata not found</ThemedText>
        </View>
      )}
      
      {/* Add Google Ads Banner at the bottom */}
      <GoogleAdsBanner adSize="banner" testMode={true} />
      
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
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 70, // Add space for fixed action buttons
  },
  previewArea: {
    flex: 0.9, // Increased from 0.85 to give more space to the preview
    paddingHorizontal: 4, // Reduced padding to allow more space for preview
    paddingTop: 4,
  },
  templateArea: {
    flex: 0.1, // Decreased from 0.15 to give less space to template selection
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeCategoryTab: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  activeCategoryTabText: {
    color: SPOTIFY_GREEN,
    fontWeight: 'bold',
  },
  templateSelector: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  templateOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  templateIcon: {
    marginBottom: 6,
  },
  selectedTemplate: {
    borderColor: SPOTIFY_GREEN,
    backgroundColor: 'rgba(29, 185, 84, 0.05)',
  },
  templateName: {
    fontWeight: '600',
    fontSize: 12,
    color: '#666666',
  },
  selectedTemplateName: {
    color: SPOTIFY_GREEN,
  },
  paidBadge: {
    backgroundColor: SPOTIFY_GREEN,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  paidText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  previewContainer: {
    height: '100%',
    borderRadius: 6, // Reduced from 8 for more content space
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateBackground: {
    borderRadius: 6, // Reduced from 8 to match container
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
  previewContent: {
    padding: 10, // Reduced from 12 to fit more content
    backgroundColor: 'transparent', // Changed from semi-transparent to fully transparent
    margin: 8, // Reduced from 12 to fit more content
    borderRadius: 8,
    maxWidth: '95%', // Increased from 90% to show more content
    alignSelf: 'center',
    top: '30%', // Adjusted from 40% to better center the content
    transform: [{ translateY: -screenHeight * 0.25 }], // Adjusted for better vertical positioning
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: SPOTIFY_DARK,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  photoAndDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  personalInfoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: SPOTIFY_DARK,
    textAlign: 'center',
  },
  previewDetail: {
    marginBottom: 6,
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: SPOTIFY_DARK,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 6,
  },
  photoPlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photo: {
    width: 80,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 8, // Reduced from 12 for more compact layout
  },
  actionButtonsFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  downloadOptions: {
    width: '100%',
  },
  downloadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: SPOTIFY_DARK,
    textAlign: 'center',
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailsGrid: {
    marginTop: 6, // Reduced from 8
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4, // Reduced from 6 for more compact layout
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: SPOTIFY_DARK,
    minWidth: '30%', // Reduced from 35% to allow more space for values
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  detailValue: {
    fontSize: 12,
    color: '#333333',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  siblingsContainer: {
    flex: 1,
  },
  previewSection: {
    marginBottom: 8, // Reduced from 12 for more compact layout
  },
}); 