import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'header';
  weight?: 'normal' | 'bold' | 'semibold';
}

export function ThemedText({ 
  style, 
  type = 'body', 
  weight = 'normal',
  ...props 
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Default text color is dark for light mode, light for dark mode
  const color = isDark ? '#FFFFFF' : '#121212';
  
  // Combine type and weight styles
  const combinedStyle = [
    styles.base,
    styles[type],
    weight === 'bold' ? styles.bold : weight === 'semibold' ? styles.semibold : styles.normal,
    { color },
    style
  ];

  return <Text style={combinedStyle} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
    fontSize: 16,
  },
  normal: {
    fontWeight: '400',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    opacity: 0.7,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
