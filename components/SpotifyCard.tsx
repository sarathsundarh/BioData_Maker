import React from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  ViewStyle, 
  ImageSourcePropType,
  Dimensions
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface SpotifyCardProps {
  title: string;
  subtitle?: string;
  imageUri?: string | null;
  onPress?: () => void;
  onOptionsPress?: () => void;
  style?: ViewStyle;
  aspectRatio?: number;
  icon?: string;
  iconColor?: string;
}

export function SpotifyCard({
  title,
  subtitle,
  imageUri,
  onPress,
  onOptionsPress,
  style,
  aspectRatio = 1,
  icon,
  iconColor = '#1DB954' // Spotify green
}: SpotifyCardProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2; // 2 cards per row with margins
  
  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              { aspectRatio }
            ]}
          />
        ) : (
          <View 
            style={[
              styles.placeholderImage,
              { aspectRatio }
            ]}
          >
            {icon && (
              <Ionicons name={icon as any} size={cardWidth/3} color={iconColor} />
            )}
          </View>
        )}
        
        {onOptionsPress && (
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={onOptionsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <ThemedText type="subtitle" numberOfLines={1}>{title}</ThemedText>
        {subtitle && (
          <ThemedText type="caption" numberOfLines={1}>{subtitle}</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: undefined,
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: undefined,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 4,
  },
  optionsButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 