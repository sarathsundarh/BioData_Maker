import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

// Spotify green color
const SPOTIFY_GREEN = '#1DB954';

export function TermsOfUseContent() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Terms of Use</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        Welcome to BioData Maker. By accessing or using our application, you agree to be bound by these Terms of Use.
      </ThemedText>
      
      <ThemedText style={styles.heading}>1. Acceptance of Terms</ThemedText>
      <ThemedText style={styles.paragraph}>
        By accessing or using BioData Maker, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our application.
      </ThemedText>
      
      <ThemedText style={styles.heading}>2. User Accounts</ThemedText>
      <ThemedText style={styles.paragraph}>
        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
      </ThemedText>
      
      <ThemedText style={styles.heading}>3. User Content</ThemedText>
      <ThemedText style={styles.paragraph}>
        You retain all rights to the content you create using BioData Maker. However, by using our application, you grant us a non-exclusive, royalty-free license to use, store, and display your content solely for the purpose of providing our services to you.
      </ThemedText>
      
      <ThemedText style={styles.heading}>4. Prohibited Activities</ThemedText>
      <ThemedText style={styles.paragraph}>
        You agree not to use BioData Maker for any unlawful purpose or in any way that could damage, disable, or impair our services. You also agree not to attempt to gain unauthorized access to any part of our application or any system connected to our servers.
      </ThemedText>
      
      <ThemedText style={styles.heading}>5. Payments and Refunds</ThemedText>
      <ThemedText style={styles.paragraph}>
        Payments for premium templates are processed through Razorpay. All purchases are final and non-refundable unless required by law. If you believe you have been charged in error, please contact our support team.
      </ThemedText>
      
      <ThemedText style={styles.heading}>6. Termination</ThemedText>
      <ThemedText style={styles.paragraph}>
        We reserve the right to terminate or suspend your access to BioData Maker at our sole discretion, without notice, for conduct that we believe violates these Terms of Use or is harmful to other users, us, or third parties, or for any other reason.
      </ThemedText>
      
      <ThemedText style={styles.heading}>7. Changes to Terms</ThemedText>
      <ThemedText style={styles.paragraph}>
        We may modify these Terms of Use at any time. It is your responsibility to review these terms periodically. Your continued use of BioData Maker after any changes indicates your acceptance of the modified terms.
      </ThemedText>
      
      <ThemedText style={styles.heading}>8. Contact Us</ThemedText>
      <ThemedText style={styles.paragraph}>
        If you have any questions about these Terms of Use, please contact us at support@biodatamaker.com.
      </ThemedText>
      
      <ThemedText style={styles.footer}>
        Last updated: March 2023
      </ThemedText>
    </View>
  );
}

export function PrivacyPolicyContent() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Privacy Policy</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        At BioData Maker, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
      </ThemedText>
      
      <ThemedText style={styles.heading}>1. Information We Collect</ThemedText>
      <ThemedText style={styles.paragraph}>
        We collect information you provide directly to us, such as when you create or modify your account, create biodata entries, make purchases, or contact us. This information may include your name, email address, phone number, and payment information.
      </ThemedText>
      
      <ThemedText style={styles.heading}>2. How We Use Your Information</ThemedText>
      <ThemedText style={styles.paragraph}>
        We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
      </ThemedText>
      
      <ThemedText style={styles.heading}>3. Information Sharing</ThemedText>
      <ThemedText style={styles.paragraph}>
        We do not share your personal information with third parties except as described in this Privacy Policy. We may share your information with service providers who perform services on our behalf, such as payment processing and data analysis.
      </ThemedText>
      
      <ThemedText style={styles.heading}>4. Data Security</ThemedText>
      <ThemedText style={styles.paragraph}>
        We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
      </ThemedText>
      
      <ThemedText style={styles.heading}>5. Your Choices</ThemedText>
      <ThemedText style={styles.paragraph}>
        You can access and update certain information about yourself by logging into your account settings. You may also request that we delete your account and associated data by contacting us.
      </ThemedText>
      
      <ThemedText style={styles.heading}>6. Changes to This Policy</ThemedText>
      <ThemedText style={styles.paragraph}>
        We may modify this Privacy Policy from time to time. If we make material changes, we will notify you through the application or by other means.
      </ThemedText>
      
      <ThemedText style={styles.heading}>7. Contact Us</ThemedText>
      <ThemedText style={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us at privacy@biodatamaker.com.
      </ThemedText>
      
      <ThemedText style={styles.footer}>
        Last updated: March 2023
      </ThemedText>
    </View>
  );
}

export function AboutUsContent() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>About BioData Maker</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        BioData Maker is a comprehensive solution for creating, managing, and sharing marriage biodata profiles. Our mission is to simplify the process of creating professional and attractive biodata documents for matrimonial purposes.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Our Story</ThemedText>
      <ThemedText style={styles.paragraph}>
        BioData Maker was founded in 2023 with a simple goal: to modernize the traditional biodata creation process. We recognized that many people struggled with creating professional-looking biodatas and wanted to provide an easy-to-use solution that would help individuals present themselves in the best possible light.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Our Mission</ThemedText>
      <ThemedText style={styles.paragraph}>
        Our mission is to empower individuals in their matrimonial journey by providing them with tools to create impressive and comprehensive biodatas. We believe that a well-crafted biodata can make a significant difference in the matchmaking process.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Our Team</ThemedText>
      <ThemedText style={styles.paragraph}>
        BioData Maker is developed by a dedicated team of professionals who are passionate about creating user-friendly applications. Our team combines expertise in technology, design, and cultural understanding to deliver a product that meets the unique needs of our users.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Contact Us</ThemedText>
      <ThemedText style={styles.paragraph}>
        We value your feedback and are always looking for ways to improve our application. If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us at contact@biodatamaker.com.
      </ThemedText>
      
      <ThemedText style={styles.paragraph}>
        Thank you for choosing BioData Maker!
      </ThemedText>
    </View>
  );
}

export function ContactUsContent() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Contact Us</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        We'd love to hear from you! If you have any questions, suggestions, or need assistance with BioData Maker, please don't hesitate to reach out to us.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Customer Support</ThemedText>
      <ThemedText style={styles.paragraph}>
        For general inquiries and customer support:
      </ThemedText>
      <ThemedText style={styles.contactInfo}>Email: support@biodatamaker.com</ThemedText>
      <ThemedText style={styles.contactInfo}>Phone: +91 98765 43210</ThemedText>
      <ThemedText style={styles.contactInfo}>Hours: Monday to Friday, 9:00 AM to 6:00 PM IST</ThemedText>
      
      <ThemedText style={styles.heading}>Technical Support</ThemedText>
      <ThemedText style={styles.paragraph}>
        For technical issues or bug reports:
      </ThemedText>
      <ThemedText style={styles.contactInfo}>Email: tech@biodatamaker.com</ThemedText>
      
      <ThemedText style={styles.heading}>Business Inquiries</ThemedText>
      <ThemedText style={styles.paragraph}>
        For partnerships, collaborations, or business opportunities:
      </ThemedText>
      <ThemedText style={styles.contactInfo}>Email: business@biodatamaker.com</ThemedText>
      
      <ThemedText style={styles.heading}>Office Address</ThemedText>
      <ThemedText style={styles.contactInfo}>BioData Maker</ThemedText>
      <ThemedText style={styles.contactInfo}>123 Tech Park, Suite 456</ThemedText>
      <ThemedText style={styles.contactInfo}>Bangalore, Karnataka 560001</ThemedText>
      <ThemedText style={styles.contactInfo}>India</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        We aim to respond to all inquiries within 24-48 business hours. Thank you for your patience and for choosing BioData Maker!
      </ThemedText>
    </View>
  );
}

export function HelpFaqContent() {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Help & FAQ</ThemedText>
      
      <ThemedText style={styles.paragraph}>
        Welcome to the BioData Maker Help Center. Here you'll find answers to frequently asked questions and helpful tips for using our application.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Getting Started</ThemedText>
      
      <ThemedText style={styles.question}>How do I create a new biodata?</ThemedText>
      <ThemedText style={styles.answer}>
        To create a new biodata, tap the "+" button on the home screen or select "Create New Biodata" from the menu. Fill in the required information and tap "Save" to create your biodata.
      </ThemedText>
      
      <ThemedText style={styles.question}>Can I edit my biodata after creating it?</ThemedText>
      <ThemedText style={styles.answer}>
        Yes, you can edit your biodata at any time. On the home screen, find the biodata you want to edit, then tap the pencil icon. Make your changes and tap "Save" to update your biodata.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Templates and Downloads</ThemedText>
      
      <ThemedText style={styles.question}>What templates are available for my biodata?</ThemedText>
      <ThemedText style={styles.answer}>
        BioData Maker offers several templates, including a free "Classic" template and premium templates like "Floral" and "Modern". You can preview all templates before choosing one for your biodata.
      </ThemedText>
      
      <ThemedText style={styles.question}>How do I download my biodata?</ThemedText>
      <ThemedText style={styles.answer}>
        To download your biodata, first view the biodata details, then tap "Preview Biodata". Select your preferred template and tap "Download" to save your biodata as a PDF or PNG file.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Premium Templates</ThemedText>
      
      <ThemedText style={styles.question}>How do I purchase a premium template?</ThemedText>
      <ThemedText style={styles.answer}>
        When previewing your biodata, select a premium template and tap "Purchase Template". Follow the payment instructions to complete your purchase using Razorpay.
      </ThemedText>
      
      <ThemedText style={styles.question}>Are premium template purchases refundable?</ThemedText>
      <ThemedText style={styles.answer}>
        Premium template purchases are generally non-refundable. However, if you encounter any issues with your purchase, please contact our support team for assistance.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Account and Data</ThemedText>
      
      <ThemedText style={styles.question}>Is my biodata information secure?</ThemedText>
      <ThemedText style={styles.answer}>
        Yes, we take data security seriously. Your biodata information is stored locally on your device and is not shared with third parties without your consent. For more information, please refer to our Privacy Policy.
      </ThemedText>
      
      <ThemedText style={styles.question}>How can I delete my biodata?</ThemedText>
      <ThemedText style={styles.answer}>
        To delete a biodata, go to the home screen, find the biodata you want to delete, and tap the trash icon. Confirm your decision when prompted.
      </ThemedText>
      
      <ThemedText style={styles.heading}>Need More Help?</ThemedText>
      <ThemedText style={styles.paragraph}>
        If you couldn't find the answer to your question, please contact our support team at support@biodatamaker.com or use the Feedback option in the menu to send us your query.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: SPOTIFY_GREEN,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: SPOTIFY_GREEN,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 20,
    color: '#000000',
  },
  footer: {
    marginTop: 24,
    fontStyle: 'italic',
    opacity: 0.7,
    color: '#000000',
  },
  contactInfo: {
    marginBottom: 4,
    marginLeft: 16,
    color: '#000000',
  },
  question: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: SPOTIFY_GREEN,
  },
  answer: {
    marginBottom: 12,
    marginLeft: 16,
    lineHeight: 20,
    color: '#000000',
  },
}); 