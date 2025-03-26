import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';

interface FeedbackFormProps {
  onClose: () => void;
}

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !feedback.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would send the feedback to a server
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully.',
        [{ text: 'OK', onPress: onClose }]
      );
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.description}>
        We value your feedback! Please let us know how we can improve BioData Maker.
      </ThemedText>

      <View style={styles.field}>
        <ThemedText style={styles.fieldLabel}>Name *</ThemedText>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.fieldLabel}>Email *</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <ThemedText style={styles.fieldLabel}>Feedback *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Enter your feedback"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <ThemedText style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    marginBottom: 20,
    lineHeight: 20,
    color: SPOTIFY_GREEN,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: SPOTIFY_GREEN,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: SPOTIFY_GREEN,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
}); 