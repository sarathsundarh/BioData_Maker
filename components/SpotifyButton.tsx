import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  ActivityIndicator 
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface SpotifyButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export function SpotifyButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  style,
  disabled = false,
  loading = false,
}: SpotifyButtonProps) {
  // Spotify's primary green color
  const primaryColor = '#1DB954';
  
  // Determine background color based on variant
  let backgroundColor = primaryColor;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';
  
  if (variant === 'secondary') {
    backgroundColor = '#535353';
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = primaryColor;
    borderWidth = 1;
    borderColor = primaryColor;
  } else if (variant === 'text') {
    backgroundColor = 'transparent';
    textColor = primaryColor;
  }
  
  // Determine padding based on size
  let paddingVertical = 12;
  let paddingHorizontal = 24;
  let fontSize = 16;
  let iconSize = 20;
  
  if (size === 'small') {
    paddingVertical = 8;
    paddingHorizontal = 16;
    fontSize = 14;
    iconSize = 16;
  } else if (size === 'large') {
    paddingVertical = 16;
    paddingHorizontal = 32;
    fontSize = 18;
    iconSize = 24;
  }
  
  // Apply opacity if disabled
  const opacity = disabled ? 0.5 : 1;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          paddingVertical,
          paddingHorizontal,
          borderWidth,
          borderColor,
          opacity,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={textColor} 
              style={styles.leftIcon} 
            />
          )}
          
          <ThemedText 
            style={[styles.text, { color: textColor, fontSize }]}
          >
            {title}
          </ThemedText>
          
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon as any} 
              size={iconSize} 
              color={textColor} 
              style={styles.rightIcon} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50, // Spotify uses very rounded buttons
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
}); 