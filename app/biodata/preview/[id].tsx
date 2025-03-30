import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Image, ImageBackground, Dimensions, ToastAndroid, Platform, Linking } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SpotifyButton } from '@/components/SpotifyButton';
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
  const [permissionStatus, setPermissionStatus] = useState<MediaLibrary.PermissionResponse | null>(null);
  
  // Reference to the view we want to capture for PNG
  const viewShotRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadBiodata(id);
    }
    
    // Request media permissions on component mount
    requestMediaPermissions();
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

  // Request permission to write to media library
  const requestMediaPermissions = async () => {
    const permissions = await MediaLibrary.requestPermissionsAsync();
    setPermissionStatus(permissions);
    
    if (!permissions.granted) {
      Alert.alert(
        "Permission Required",
        "We need permission to save files to your device. Please grant storage permission in your device settings.",
        [{ text: "OK" }]
      );
    }
  };

  // Generate a timestamp-based filename
  const generateFilename = (extension: string) => {
    const timestamp = new Date().getTime();
    return `biodata_${timestamp}.${extension}`;
  };

  // Show toast or alert based on platform
  const showNotification = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Success', message);
    }
  };

  // Save file to device and show notification
  const saveFile = async (fileUri: string, filename: string, mimeType: string) => {
    try {
      // For Android, save to the Downloads directory
      // For iOS, save to the Documents directory and then share it
      let finalUri = fileUri;
      let savedLocation = '';
      
      if (Platform.OS === 'android') {
        // Ensure we have permission
        if (!permissionStatus?.granted) {
          const permissions = await MediaLibrary.requestPermissionsAsync();
          if (!permissions.granted) {
            Alert.alert("Permission Required", "Storage permission is needed to save files.");
            return null;
          }
        }
        
        // Save to the MediaLibrary (which is accessible via Gallery/Files)
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync('BiodataApp');
        
        if (album === null) {
          await MediaLibrary.createAlbumAsync('BiodataApp', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        
        finalUri = asset.uri;
        savedLocation = 'Gallery > BiodataApp album';
      } else {
        // For iOS, we'll save to the documents directory and open the share dialog
        const documentsDir = FileSystem.documentDirectory;
        const destinationUri = `${documentsDir}${filename}`;
        
        await FileSystem.copyAsync({
          from: fileUri,
          to: destinationUri
        });
        
        finalUri = destinationUri;
        savedLocation = 'Files app';
      }
      
      // Show notification
      showNotification(`File saved to ${savedLocation}`);
      
      // Open the file
      openFile(finalUri, mimeType);
      
      return finalUri;
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save file to device');
      return null;
    }
  };

  // Function to open a file using the appropriate system viewer
  const openFile = async (fileUri: string, mimeType: string) => {
    try {
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Use expo-sharing to share the file
        await Sharing.shareAsync(fileUri, {
          mimeType: mimeType,
          dialogTitle: 'Your biodata is ready!',
        });
      } else if (Platform.OS === 'android') {
        // For Android, inform the user where to find the file
        Alert.alert(
          'File Saved',
          `Your file has been saved to the BiodataApp album in your Gallery. Please check your Gallery app.`,
          [{ text: 'OK' }]
        );
      } else {
        // For iOS or other platforms
        Alert.alert(
          'File Saved',
          `Your file has been saved to your device.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening/sharing file:', error);
      // Inform the user the file was saved even if sharing failed
      showNotification('File saved to your device');
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    
    try {
      if (!permissionStatus?.granted) {
        await requestMediaPermissions();
        if (!permissionStatus?.granted) {
          setDownloading(false);
          return;
        }
      }
      
      // For demonstration, we'll just capture the view as an image
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 0.9
        });
        
        // Generate filename with timestamp
        const timestamp = new Date().getTime();
        const filename = `biodata_${timestamp}.png`;
        
        // For demonstration, we're saving a PNG but showing PDF in the UI
        // In a production app, you'd use react-native-html-to-pdf to create a real PDF
        const savedPath = await saveFile(uri, filename, 'image/png');
        
        if (savedPath) {
          console.log('Image saved at:', savedPath);
          // Let the user know it's actually an image file (for demonstration)
          Alert.alert(
            'Note',
            'For demonstration purposes, we\'ve created a PNG image. In a real app, this would be a PDF document.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    
    try {
      if (!permissionStatus?.granted) {
        await requestMediaPermissions();
        if (!permissionStatus?.granted) {
          setDownloading(false);
          return;
        }
      }
      
      if (viewShotRef.current) {
        // Capture the view as a high-quality PNG
        const uri = await captureRef(viewShotRef, {
          format: 'png',
          quality: 1.0
        });
        
        // Generate filename with timestamp
        const timestamp = new Date().getTime();
        const filename = `biodata_${timestamp}.png`;
        
        // Save the file and get the saved path
        const savedPath = await saveFile(uri, filename, 'image/png');
        
        if (savedPath) {
          console.log('PNG saved at:', savedPath);
        }
      }
    } catch (error) {
      console.error('Error generating PNG:', error);
      Alert.alert('Error', 'Failed to generate PNG image');
    } finally {
      setDownloading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Filter templates based on person's religion and include general templates
  const getReligiousTemplates = () => {
    if (!biodata) return templates.filter(template => template.category === 'general');
    
    let religionCategory: TemplateCategory = 'general';
    
    if (biodata.religion.toLowerCase().includes('hindu')) {
      religionCategory = 'hindu';
    } else if (biodata.religion.toLowerCase().includes('muslim') || 
               biodata.religion.toLowerCase().includes('islam')) {
      religionCategory = 'muslim';
    } else if (biodata.religion.toLowerCase().includes('christian') || 
               biodata.religion.toLowerCase().includes('catholic')) {
      religionCategory = 'christian';
    }
    
    // Return templates matching the religion or general templates
    return templates.filter(template => 
      template.category === religionCategory || template.category === 'general'
    );
  };
  
  const religiousTemplates = getReligiousTemplates();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ 
        title: "Preview Biodata",
        headerShown: false
      }} />
      
      {/* Small back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <Ionicons name="hourglass-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : biodata ? (
        <View style={styles.mainContent}>
          {/* MAIN PREVIEW SECTION - No back button */}
          <View style={styles.previewArea} ref={viewShotRef}>
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

              <ScrollView style={styles.scrollContainer}>
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
                          <Ionicons name="person" size={30} color="#FFFFFF" />
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
                      <Ionicons name="person" size={12} color="#333" style={styles.sectionIcon} />
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
                      <Ionicons name="people" size={12} color="#333" style={styles.sectionIcon} />
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
                      <Ionicons name="call" size={12} color="#333" style={styles.sectionIcon} />
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
              </ScrollView>
            </ImageBackground>
          </View>

          {/* TEMPLATE SELECTION AREA - MOVED TO FIXED POSITION AT BOTTOM */}
          <View style={styles.bottomContainer}>
            {/* Template Selector */}
            <View style={styles.templateSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {religiousTemplates.map((template) => (
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

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {selectedTemplate.isPaid && !isPurchased ? (
                <SpotifyButton
                  title={`Purchase Template (₹${selectedTemplate.price})`}
                  onPress={handlePurchase}
                  icon="cart-outline"
                  variant="secondary"
                />
              ) : (
                <View style={styles.downloadOptions}>
                  <View style={styles.downloadButtons}>
                    <SpotifyButton
                      title={downloading ? "Saving..." : "Save as PDF"}
                      onPress={handleDownloadPDF}
                      icon="document-text-outline"
                      style={styles.downloadButton}
                      disabled={downloading}
                      loading={downloading}
                      size="medium"
                    />
                    <SpotifyButton
                      title={downloading ? "Saving..." : "Save as Image"}
                      onPress={handleDownloadPNG}
                      icon="image-outline"
                      style={styles.downloadButton}
                      variant="secondary"
                      disabled={downloading}
                      loading={downloading}
                      size="medium"
                    />
                  </View>
                  {downloading ? (
                    <ThemedText style={styles.savingText}>
                      Saving your biodata, please wait...
                    </ThemedText>
                  ) : (
                    <ThemedText style={styles.savingText}>
                      Files will be saved to your device and can be shared immediately
                    </ThemedText>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={SPOTIFY_GREEN} />
          <ThemedText style={styles.notFoundText}>Biodata not found</ThemedText>
        </View>
      )}
      
      <StatusBar style="dark" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: SPOTIFY_GREEN,
  },
  notFoundText: {
    marginTop: 12,
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  previewArea: {
    flex: 0.75, // Take up 75% of the available space
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  templateSelector: {
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  templateOption: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 6,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  templateIcon: {
    marginBottom: 3,
  },
  selectedTemplate: {
    borderColor: SPOTIFY_GREEN,
    backgroundColor: 'rgba(29, 185, 84, 0.05)',
  },
  templateName: {
    fontWeight: '600',
    fontSize: 10,
    color: '#666666',
  },
  selectedTemplateName: {
    color: SPOTIFY_GREEN,
  },
  paidBadge: {
    backgroundColor: SPOTIFY_GREEN,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  paidText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
  },
  previewContainer: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateBackground: {
    borderRadius: 8,
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
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 0.2)',
    transform: [{ rotate: '-45deg' }],
  },
  scrollContainer: {
    flex: 1,
  },
  previewContent: {
    padding: 5,
    backgroundColor: 'transparent',
    margin: 5,
    borderRadius: 0,
    alignSelf: 'center',
    width: '97%',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 5,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  photoAndDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  personalInfoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  previewName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
    color: SPOTIFY_DARK,
    textAlign: 'center',
  },
  previewDetail: {
    marginBottom: 3,
    fontSize: 11,
    color: '#333333',
    lineHeight: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    alignSelf: 'flex-start',
    width: '100%',
  },
  sectionIcon: {
    marginRight: 4,
  },
  photoPlaceholder: {
    width: 70,
    height: 85,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photo: {
    width: 70,
    height: 85,
    alignSelf: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 6,
  },
  actionButtons: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: '#FFFFFF',
  },
  downloadOptions: {
    width: '100%',
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadButton: {
    flex: 1,
    marginHorizontal: 3,
  },
  detailsGrid: {
    marginTop: 2,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 1,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#333',
    minWidth: '35%',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  detailValue: {
    fontSize: 10,
    color: '#333',
    flex: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  siblingsContainer: {
    flex: 1,
  },
  previewSection: {
    marginBottom: 4,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Below notification bar
    left: 15,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  savingText: {
    marginTop: 8,
    fontSize: 12,
    color: SPOTIFY_GREEN,
    textAlign: 'center',
  },
}); 