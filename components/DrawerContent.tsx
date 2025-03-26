import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { router } from 'expo-router';
import { InfoModal } from './InfoModal';
import { FeedbackForm } from './FeedbackForm';
import { 
  TermsOfUseContent, 
  PrivacyPolicyContent, 
  AboutUsContent, 
  ContactUsContent,
  HelpFaqContent 
} from './ModalContents';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';

interface DrawerItemProps {
  label: string;
  icon: string;
  onPress: () => void;
  isActive?: boolean;
}

function DrawerItem({ label, icon, onPress, isActive = false }: DrawerItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.drawerItem, 
        isActive && styles.activeDrawerItem
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon as any} 
        size={22} 
        color={SPOTIFY_GREEN} 
      />
      <ThemedText 
        style={[
          styles.drawerItemText,
          { color: SPOTIFY_GREEN },
          isActive && styles.activeDrawerItemText
        ]}
        weight={isActive ? 'bold' : 'normal'}
      >
        {label}
      </ThemedText>
      
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

export function DrawerContent({ closeDrawer }: { closeDrawer: () => void }) {
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [helpFaqModalVisible, setHelpFaqModalVisible] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  // Modified to keep drawer open when navigating
  const navigateTo = (route: 'home' | 'new') => {
    setActiveItem(route);
    // We'll keep the drawer open and let the user close it manually
    if (route === 'home') {
      router.push('/');
    } else if (route === 'new') {
      router.push('/biodata/new');
    }
  };

  // Modified to keep drawer open when opening modals
  const openModal = (modalType: 'terms' | 'privacy' | 'feedback' | 'about' | 'contact' | 'help') => {
    setActiveItem(modalType);
    // We'll keep the drawer open and let the user close it manually
    switch (modalType) {
      case 'terms':
        setTermsModalVisible(true);
        break;
      case 'privacy':
        setPrivacyModalVisible(true);
        break;
      case 'feedback':
        setFeedbackModalVisible(true);
        break;
      case 'about':
        setAboutModalVisible(true);
        break;
      case 'contact':
        setContactModalVisible(true);
        break;
      case 'help':
        setHelpFaqModalVisible(true);
        break;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="person-circle" size={32} color={SPOTIFY_GREEN} />
          <ThemedText type="title" weight="bold" style={styles.logoText}>
            BioData Maker
          </ThemedText>
        </View>
        <TouchableOpacity 
          onPress={closeDrawer}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color={SPOTIFY_GREEN} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <ThemedText type="caption" style={[styles.sectionTitle, { color: SPOTIFY_GREEN }]}>MAIN</ThemedText>
          <View style={styles.drawerItems}>
            <DrawerItem 
              label="Home" 
              icon="home" 
              onPress={() => navigateTo('home')} 
              isActive={activeItem === 'home'}
            />
            <DrawerItem 
              label="Create New Biodata" 
              icon="add-circle" 
              onPress={() => navigateTo('new')} 
              isActive={activeItem === 'new'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="caption" style={[styles.sectionTitle, { color: SPOTIFY_GREEN }]}>HELP & LEGAL</ThemedText>
          <View style={styles.drawerItems}>
            <DrawerItem 
              label="Help & FAQ" 
              icon="help-circle" 
              onPress={() => openModal('help')} 
              isActive={activeItem === 'help'}
            />
            <DrawerItem 
              label="Terms of Use" 
              icon="document-text" 
              onPress={() => openModal('terms')} 
              isActive={activeItem === 'terms'}
            />
            <DrawerItem 
              label="Privacy Policy" 
              icon="shield-checkmark" 
              onPress={() => openModal('privacy')} 
              isActive={activeItem === 'privacy'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="caption" style={[styles.sectionTitle, { color: SPOTIFY_GREEN }]}>CONTACT</ThemedText>
          <View style={styles.drawerItems}>
            <DrawerItem 
              label="Feedback" 
              icon="chatbubble" 
              onPress={() => openModal('feedback')} 
              isActive={activeItem === 'feedback'}
            />
            <DrawerItem 
              label="Contact Us" 
              icon="call" 
              onPress={() => openModal('contact')} 
              isActive={activeItem === 'contact'}
            />
            <DrawerItem 
              label="About Us" 
              icon="information-circle" 
              onPress={() => openModal('about')} 
              isActive={activeItem === 'about'}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedText style={[styles.versionText, { color: SPOTIFY_GREEN }]}>Version 1.0.0</ThemedText>
      </View>

      {/* Modals */}
      <InfoModal
        visible={termsModalVisible}
        title="Terms of Use"
        content={<TermsOfUseContent />}
        onClose={() => setTermsModalVisible(false)}
      />

      <InfoModal
        visible={privacyModalVisible}
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
        onClose={() => setPrivacyModalVisible(false)}
      />

      <InfoModal
        visible={feedbackModalVisible}
        title="Feedback"
        content={<FeedbackForm onClose={() => setFeedbackModalVisible(false)} />}
        onClose={() => setFeedbackModalVisible(false)}
      />

      <InfoModal
        visible={contactModalVisible}
        title="Contact Us"
        content={<ContactUsContent />}
        onClose={() => setContactModalVisible(false)}
      />

      <InfoModal
        visible={helpFaqModalVisible}
        title="Help & FAQ"
        content={<HelpFaqContent />}
        onClose={() => setHelpFaqModalVisible(false)}
      />

      <InfoModal
        visible={aboutModalVisible}
        title="About Us"
        content={<AboutUsContent />}
        onClose={() => setAboutModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 8,
    color: SPOTIFY_GREEN, // Spotify green
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: SPOTIFY_GREEN,
    letterSpacing: 1,
  },
  drawerItems: {
    marginTop: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    position: 'relative',
  },
  activeDrawerItem: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)', // Light green background
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: SPOTIFY_GREEN,
  },
  activeDrawerItemText: {
    color: SPOTIFY_GREEN,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    backgroundColor: SPOTIFY_GREEN, // Spotify green
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
    color: SPOTIFY_GREEN,
  },
}); 