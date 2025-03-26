import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

interface GoogleAdsBannerProps {
  adUnitID?: string;
  adSize?: 'banner' | 'largeBanner' | 'fluid';
  testMode?: boolean;
}

const GoogleAdsBanner: React.FC<GoogleAdsBannerProps> = ({
  adUnitID = 'ca-pub-1234567890123456',
  adSize = 'banner',
  testMode = true
}) => {
  // In a real implementation, this would use the appropriate ad library like
  // react-native-google-mobile-ads or a WebView with AdSense for web
  
  // For now, we're creating a placeholder that simulates the ad banner
  // In a production app, you would replace this with the actual Google Ads implementation
  
  const getBannerHeight = () => {
    switch (adSize) {
      case 'largeBanner':
        return 100;
      case 'fluid':
        return 90;
      case 'banner':
      default:
        return 50;
    }
  };
  
  return (
    <View style={[styles.adBannerContainer, { height: getBannerHeight() }]}>
      <ThemedView style={[styles.adBanner, { height: getBannerHeight() }]}>
        {testMode && (
          <>
            <ThemedText style={styles.adText}>Google AdSense Banner</ThemedText>
            <ThemedText style={styles.adSubtext}>{`Ad Unit ID: ${adUnitID}`}</ThemedText>
            <ThemedText style={styles.adSubtext}>{`Size: ${adSize}`}</ThemedText>
          </>
        )}
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  adBannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: screenWidth,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  adBanner: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
  },
  adText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  adSubtext: {
    fontSize: 10,
    color: '#888',
  },
});

export default GoogleAdsBanner; 