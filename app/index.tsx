import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const GoogleAdsBanner = () => {
  return (
    <View style={styles.adBannerContainer}>
      <ThemedView style={styles.adBanner}>
        <ThemedText style={styles.adText}>Google AdSense Banner</ThemedText>
        <ThemedText style={styles.adSubtext}>Ad ID: ca-pub-1234567890123456</ThemedText>
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
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  adBanner: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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