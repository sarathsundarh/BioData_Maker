import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export function FloatingActionButton({
  onPress,
  icon = 'add',
  style,
  size = 'medium',
}: FloatingActionButtonProps) {
  // Spotify's primary green color
  const backgroundColor = '#1DB954';
  
  // Determine size based on prop
  let buttonSize = 56;
  let iconSize = 24;
  
  if (size === 'small') {
    buttonSize = 48;
    iconSize = 20;
  } else if (size === 'large') {
    buttonSize = 64;
    iconSize = 28;
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={iconSize} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
}); 