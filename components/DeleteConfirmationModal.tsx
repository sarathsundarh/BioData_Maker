import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { SpotifyButton } from './SpotifyButton';
import { Ionicons } from '@expo/vector-icons';

interface DeleteConfirmationModalProps {
  visible: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  visible,
  name,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF5252" />
          </View>
          
          <ThemedText type="title" weight="bold" style={styles.title}>
            Delete Confirmation
          </ThemedText>
          
          <ThemedText style={styles.message}>
            Are you sure you want to delete "{name}"? This action cannot be undone.
          </ThemedText>
          
          <View style={styles.buttonContainer}>
            <SpotifyButton
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            
            <SpotifyButton
              title="Delete"
              onPress={onConfirm}
              variant="secondary"
              style={styles.deleteButton}
              icon="trash-outline"
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
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#FF5252', // Red color for delete
  },
}); 