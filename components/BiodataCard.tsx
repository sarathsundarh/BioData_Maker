import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SpotifyCard } from './SpotifyCard';

interface BiodataCardProps {
  id: string;
  name: string;
  description: string;
  photoUri?: string | null;
  onDelete: (id: string) => void;
}

export function BiodataCard({ id, name, description, photoUri, onDelete }: BiodataCardProps) {
  const handlePress = () => {
    router.push(`/biodata/${id}`);
  };

  const handleEdit = () => {
    router.push(`/biodata/edit/${id}`);
  };

  const handleOptionsPress = () => {
    // In a real app, you might show a menu here
    // For simplicity, we'll just navigate to edit
    handleEdit();
  };

  return (
    <SpotifyCard
      title={name}
      subtitle={description}
      imageUri={photoUri}
      onPress={handlePress}
      onOptionsPress={handleOptionsPress}
      aspectRatio={1}
      icon={!photoUri ? "person-circle-outline" : undefined}
      iconColor="#1DB954"
    />
  );
} 