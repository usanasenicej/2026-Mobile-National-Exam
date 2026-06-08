import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDictionary } from '../context/DictionaryContext';
import { COLORS } from '../constants/colors';
import WordDetailCard from '../components/WordDetailCard';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [inputWord, setInputWord] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  const { searchWord, loading, error, wordData, currentWord } = useDictionary();

  const validateInput = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setInputError('Please enter a word to search.');
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      setInputError('Please enter a valid English word.');
      return false;
    }
    setInputError('');
    return true;
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    if (!validateInput(inputWord)) return;
    searchWord(inputWord.trim());
  };

  const handleInputChange = (text) => {
    setInputWord(text);
    if (inputError) setInputError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative background circles */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />

        {/* ── Hero Section ── */}
        {!wordData && !loading && !error && (
          <View style={styles.heroContainer}>
            <View style={styles.heroIconWrapper}>
              <Ionicons name="book" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>LexiSearch</Text>
            <Text style={styles.heroSubtitle}>
              Discover word meanings, pronunciations, and usage examples instantly.
            </Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Free Dictionary API</Text>
            </View>
          </View>
        )}

        {/* ── Search Card ── */}
        <View style={styles.searchCard}>
          <View style={styles.searchIconRow}>
            <Ionicons name="search" size={18} color={COLORS.primary} />
            <Text style={styles.searchLabel}>Search for a word</Text>
          </View>

          <View
            style={[
              styles.inputWrapper,
              inputError ? styles.inputWrapperError : null,
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Type an English word..."
              placeholderTextColor={COLORS.textMuted}
              value={inputWord}
              onChangeText={handleInputChange}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
              accessibilityLabel="Word search input"
            />
            {inputWord.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setInputWord('');
                  setInputError('');
                }}
                style={styles.clearBtn}
                accessibilityLabel="Clear input"
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {inputError ? (
            <View style={styles.errorRow}>
              <Ionicons name="warning" size={14} color={COLORS.errorRed} />
              <Text style={styles.inputErrorText}>{inputError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.85}
            accessibilityLabel="Search button"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <View style={styles.searchButtonContent}>
                <Text style={styles.searchButtonText}>Search</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingTitle}>Looking up</Text>
              <Text style={styles.loadingWord}>"{inputWord.trim()}"</Text>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </View>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <View style={styles.errorIconWrapper}>
                <Ionicons name="search-outline" size={36} color={COLORS.errorRed} />
              </View>
              <Text style={styles.errorTitle}>Word Not Found</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleSearch}
                activeOpacity={0.85}
                accessibilityLabel="Retry search"
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Results ── */}
        {!loading && !error && wordData && (
          <WordDetailCard data={wordData} word={currentWord} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
    position: 'relative',
  },

  // Decorative background circles
  bgCircle1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.6,
  },
  bgCircle2: {
    position: 'absolute',
    top: 200,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accentLight,
    opacity: 0.5,
  },
  bgCircle3: {
    position: 'absolute',
    bottom: 300,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.4,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 36,
    position: 'relative',
    zIndex: 1,
  },
  heroIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  heroIcon: {
    fontSize: 40,
    color: COLORS.primary,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  heroBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  // Search Card
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    marginTop: 8,
    elevation: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    position: 'relative',
    zIndex: 1,
  },
  searchIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 0,
  },
  searchLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    height: 54,
  },
  inputWrapperError: {
    borderColor: COLORS.errorRed,
    backgroundColor: COLORS.errorBg,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
  },
  errorDot: {
    color: COLORS.errorRed,
    fontSize: 10,
    marginRight: 6,
  },
  inputErrorText: {
    color: COLORS.errorRed,
    fontSize: 13,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchButtonArrow: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginTop: 36,
    position: 'relative',
    zIndex: 1,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width * 0.75,
    elevation: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  loadingTitle: {
    marginTop: 18,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingWord: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },

  // Error
  errorContainer: {
    alignItems: 'center',
    marginTop: 36,
    position: 'relative',
    zIndex: 1,
  },
  errorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: width * 0.8,
    elevation: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.errorBg,
  },
  errorIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorEmoji: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default SearchScreen;
