import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { SpotifyButton } from './SpotifyButton';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';

interface InfoModalProps {
  visible: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

export function InfoModal({ visible, title, content, onClose }: InfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <ThemedText type="title" weight="bold" style={styles.title}>
              {title}
            </ThemedText>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={SPOTIFY_GREEN} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.contentScrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
          
          <View style={styles.footer}>
            <SpotifyButton
              title="Close"
              onPress={onClose}
              variant="primary"
              size="medium"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    flex: 1,
    color: SPOTIFY_GREEN,
  },
  closeButton: {
    padding: 4,
  },
  contentScrollView: {
    maxHeight: '70%',
  },
  contentContainer: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
  },
}); 