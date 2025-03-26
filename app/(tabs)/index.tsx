import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Platform, 
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StatusBar as RNStatusBar,
  ScrollView,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { DrawerContent } from '@/components/DrawerContent';
import { BiodataPreview, Biodata } from '@/models/biodata';
import { getAllBiodataPreviews, deleteBiodata, createBiodata } from '@/services/biodataService';
import { SpotifyButton } from '@/components/SpotifyButton';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';
const SPOTIFY_DARK = '#191414';

// Define styles first to avoid linter errors
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
    padding: 16,
    paddingBottom: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 0,
  },
  appLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  appLogo: {
    marginRight: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: SPOTIFY_GREEN,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: SPOTIFY_GREEN,
  },
  emptySubtext: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  createButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  biodataCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  photoContainer: {
    marginRight: 16,
  },
  photoWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: 70,
    height: 70,
  },
  photoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: SPOTIFY_DARK,
  },
  description: {
    marginTop: 4,
    color: '#666',
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  actionButton: {
    padding: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonInner: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 999,
  },
  addIcon: {
    color: '#FFFFFF',
  },
  formModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formModalContainer: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: SPOTIFY_GREEN,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  formScrollView: {
    padding: 20,
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
  focusedInput: {
    borderColor: SPOTIFY_GREEN,
    borderWidth: 2,
  },
  formPhotoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  formPhotoContainer: {
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
  formPhoto: {
    width: 140,
    height: 140,
  },
  formPhotoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: SPOTIFY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formPhotoHint: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
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
    color: '#000000',  // Black color for unselected salutation
  },
  formFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
  },
  disabledSaveButton: {
    flex: 1,
    opacity: 0.7,
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
});

// Custom BiodataCard component specifically for the home screen
interface BiodataListCardProps {
  item: BiodataPreview;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function BiodataListCard({ item, onView, onEdit, onDelete }: BiodataListCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <ThemedView type="card" style={styles.biodataCard}>
        <View style={styles.cardHeader}>
          <View style={styles.photoContainer}>
            {item.photoUri ? (
              <View style={styles.photoWrapper}>
                <Animated.Image 
                  source={{ uri: item.photoUri }} 
                  style={styles.photo}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <ThemedText style={styles.placeholderText}>
                  {item.name.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={styles.cardInfo}>
            <ThemedText type="subtitle" weight="bold" numberOfLines={1} style={styles.cardName}>
              {item.name}
            </ThemedText>
            <ThemedText type="caption" numberOfLines={2} style={styles.description}>
              {item.description}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onView(item.id)}
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.actionButtonInner}>
              <Ionicons name="eye-outline" size={22} color={SPOTIFY_GREEN} />
              <ThemedText type="caption" style={styles.actionText}>View</ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onEdit(item.id)}
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.actionButtonInner}>
              <Ionicons name="pencil-outline" size={22} color={SPOTIFY_GREEN} />
              <ThemedText type="caption" style={styles.actionText}>Edit</ThemedText>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onDelete(item.id)}
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.actionButtonInner}>
              <Ionicons name="trash-outline" size={22} color="#FF5252" />
              <ThemedText type="caption" style={styles.actionText}>Delete</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [biodata, setBiodata] = useState<BiodataPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBiodata, setSelectedBiodata] = useState<BiodataPreview | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
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
  
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-320)).current;
  
  useEffect(() => {
    loadBiodata();
  }, []);

  const loadBiodata = async () => {
    setLoading(true);
    try {
      const data = await getAllBiodataPreviews();
      setBiodata(data);
    } catch (error) {
      console.error('Error loading biodata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBiodata = () => {
    // Reset form data
    setFormData({
      salutation: 'Mr',
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
    // Show form modal
    setIsFormModalVisible(true);
  };

  const handleViewBiodata = (id: string) => {
    router.push(`/biodata/${id}`);
  };

  const handleEditBiodata = (id: string) => {
    router.push(`/biodata/edit/${id}`);
  };

  const handleDeleteBiodata = (id: string) => {
    const biodataToDelete = biodata.find(item => item.id === id);
    if (biodataToDelete) {
      setSelectedBiodata(biodataToDelete);
      setDeleteModalVisible(true);
    }
  };

  const confirmDelete = async () => {
    if (selectedBiodata) {
      try {
        await deleteBiodata(selectedBiodata.id);
        setBiodata(biodata.filter(item => item.id !== selectedBiodata.id));
      } catch (error) {
        console.error('Error deleting biodata:', error);
      } finally {
        setDeleteModalVisible(false);
        setSelectedBiodata(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedBiodata(null);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const closeDrawer = () => {
    Animated.spring(slideAnim, {
      toValue: -320,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  };

  // Form handling functions
  const handleFormChange = (field: string, value: string) => {
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

  const handleSaveForm = async () => {
    // Basic validation
    if (!formData.fullName || !formData.dateOfBirth || !formData.placeOfBirth || 
        !formData.fatherName || !formData.motherName || !formData.phoneNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const newBiodata = await createBiodata({
        ...formData,
        siblings: [],
      });
      
      // Add the new biodata to the list
      setBiodata(prev => [...prev, newBiodata]);
      
      // Close the form modal
      setIsFormModalVisible(false);
    } catch (error) {
      console.error('Error saving biodata:', error);
      Alert.alert('Error', 'Failed to save biodata. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => setIsFormModalVisible(false) },
      ]
    );
  };

  const renderBiodataItem = ({ item }: { item: BiodataPreview }) => (
    <BiodataListCard
      item={item}
      onView={handleViewBiodata}
      onEdit={handleEditBiodata}
      onDelete={handleDeleteBiodata}
    />
  );

  return (
    <>
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBackground} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={openDrawer} 
            style={styles.menuButton}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#FFFFFF" 
              style={styles.menuIcon}
            />
          </TouchableOpacity>
          
          <View style={styles.appLogoContainer}>
            <Ionicons 
              name="person-circle" 
              size={32} 
              color="#FFFFFF" 
              style={styles.appLogo}
            />
            <ThemedText style={styles.appName}>
              BioData Maker
            </ThemedText>
          </View>
          
          <View style={{ width: 40 }} />
        </View>

        {/* Content area */}
        {loading ? (
          <View style={styles.centerContainer}>
            <Ionicons name="hourglass-outline" size={64} color={SPOTIFY_GREEN} />
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </View>
        ) : biodata.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={80} color={SPOTIFY_GREEN} />
            <ThemedText type="subtitle" style={styles.emptyText}>
              No biodata found
            </ThemedText>
            <ThemedText type="caption" style={styles.emptySubtext}>
              Create your first biodata profile by tapping the + button
            </ThemedText>
            <SpotifyButton
              title="Create New Biodata"
              onPress={handleAddBiodata}
              icon="add-circle-outline"
              style={styles.createButton}
            />
          </View>
        ) : (
          <FlatList
            data={biodata}
            keyExtractor={(item) => item.id}
            renderItem={renderBiodataItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Custom Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleAddBiodata}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} style={styles.addIcon} />
        </TouchableOpacity>

        <DeleteConfirmationModal
          visible={deleteModalVisible}
          name={selectedBiodata?.name || ''}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
        
        <StatusBar style="light" />
      </ThemedView>

      {/* Drawer Modal */}
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
          
          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <DrawerContent closeDrawer={closeDrawer} />
          </Animated.View>
        </View>
      </Modal>

      {/* Biodata Form Modal */}
      <Modal
        visible={isFormModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelForm}
        statusBarTranslucent={true}
      >
        <View style={styles.formModalOverlay}>
          <View style={styles.formModalContainer}>
            <View style={styles.formHeader}>
              <ThemedText style={styles.formTitle}>
                Create New Biodata
              </ThemedText>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancelForm}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
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
              style={styles.formScrollView} 
              showsVerticalScrollIndicator={false}
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
              <View style={styles.formPhotoSection}>
                <TouchableOpacity onPress={handlePickImage} style={styles.formPhotoContainer}>
                  {formData.photoUri ? (
                    <Image source={{ uri: formData.photoUri }} style={styles.formPhoto} />
                  ) : (
                    <View style={styles.formPhotoPlaceholder}>
                      <Ionicons name="camera" size={44} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
                <ThemedText style={styles.formPhotoHint}>Tap to add profile photo</ThemedText>
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
                      onPress={() => handleFormChange('salutation', 'Mr')}
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
                      onPress={() => handleFormChange('salutation', 'Ms')}
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
                    onChangeText={(value) => handleFormChange('fullName', value)}
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
                    onChangeText={(value) => handleFormChange('dateOfBirth', value)}
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
                    onChangeText={(value) => handleFormChange('placeOfBirth', value)}
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
                    onChangeText={(value) => handleFormChange('education', value)}
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
                    onChangeText={(value) => handleFormChange('occupation', value)}
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
                    onChangeText={(value) => handleFormChange('religion', value)}
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
                    onChangeText={(value) => handleFormChange('caste', value)}
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
                    onChangeText={(value) => handleFormChange('fatherName', value)}
                    placeholder="Enter father's name"
                  />
                </View>
                
                <View style={styles.field}>
                  <ThemedText style={styles.fieldLabel}>Father's Occupation</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.fatherOccupation}
                    onChangeText={(value) => handleFormChange('fatherOccupation', value)}
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
                    onChangeText={(value) => handleFormChange('motherName', value)}
                    placeholder="Enter mother's name"
                  />
                </View>
                
                <View style={styles.field}>
                  <ThemedText style={styles.fieldLabel}>Mother's Occupation</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.motherOccupation}
                    onChangeText={(value) => handleFormChange('motherOccupation', value)}
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
                    onChangeText={(value) => handleFormChange('phoneNumber', value)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
                
                <View style={styles.field}>
                  <ThemedText style={styles.fieldLabel}>Email</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(value) => handleFormChange('email', value)}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.field}>
                  <ThemedText style={styles.fieldLabel}>Address</ThemedText>
                  <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    value={formData.address}
                    onChangeText={(value) => handleFormChange('address', value)}
                    placeholder="Enter address"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.formFooter}>
              <SpotifyButton
                title={formLoading ? "Saving..." : "Save"}
                onPress={handleSaveForm}
                disabled={formLoading}
                style={formLoading ? styles.disabledSaveButton : styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
