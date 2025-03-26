import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedViewProps extends ViewProps {
  type?: 'primary' | 'secondary' | 'card';
}

export function ThemedView({ style, type = 'primary', ...props }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  let backgroundColor = '#FFFFFF'; // Bright white background
  
  if (type === 'secondary') {
    backgroundColor = '#F8F8F8'; // Light gray for secondary backgrounds
  } else if (type === 'card') {
    backgroundColor = '#FFFFFF'; // White for cards with shadow
  }

  // For dark mode (optional)
  if (isDark) {
    if (type === 'primary') {
      backgroundColor = '#121212'; // Spotify's dark background
    } else if (type === 'secondary') {
      backgroundColor = '#181818'; // Slightly lighter dark background
    } else if (type === 'card') {
      backgroundColor = '#282828'; // Spotify's card color in dark mode
    }
  }

  const typeStyle = type === 'card' ? styles.card : {};

  return (
    <View 
      style={[{ backgroundColor }, typeStyle, style]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    marginVertical: 8,
  }
});
