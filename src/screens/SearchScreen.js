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
    if (trimmed.includes(' ')) {
      setInputError('Please search for one word, not a sentence.');
      return false;
    }
    if (/\d/.test(trimmed)) {
      setInputError('Please search for a word instead of numbers.');
      return false;
    }
    if (!/^[a-zA-Z'-]+$/.test(trimmed)) {
      setInputError('Please search for a word instead of numbers.');
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section ── */}
        <View style={styles.heroContainer}>
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="book" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.heroTitle}>LexiSearch</Text>
              <View style={styles.heroDivider} />
              <Text style={styles.heroTagline}>Your Premium Dictionary</Text>
            </View>
          </View>
        </View>

        {/* ── Search Section ── */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>Search for a word</Text>
          <View
            style={[
              styles.inputCard,
              inputError ? styles.inputCardError : null,
            ]}
          >
            <View style={styles.inputIconWrap}>
              <Ionicons name="search" size={20} color={COLORS.accent} />
            </View>
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
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingTitle}>Looking up</Text>
              <Text style={styles.loadingWord}>"{inputWord.trim()}"</Text>
            </View>
          </View>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorCard}>
              <View style={styles.errorIconCircle}>
                <Ionicons name="document-text-outline" size={32} color={COLORS.errorRed} />
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
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    flexGrow: 1,
  },

  // Hero
  heroContainer: {
    marginTop: 16,
    marginBottom: 36,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  heroGradient: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 48,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(248, 250, 252, 0.75)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  heroDivider: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 1,
    marginBottom: 14,
  },
  heroTagline: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Search
  searchSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  searchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    height: 60,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  inputCardError: {
    borderColor: COLORS.errorRed,
    backgroundColor: COLORS.errorBg,
  },
  inputIconWrap: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: COLORS.textPrimary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 4,
  },
  inputErrorText: {
    color: COLORS.errorRed,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 6,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginRight: 8,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  loadingCard: {
    backgroundColor: COLORS.loadingBg,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    width: width * 0.7,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  loadingTitle: {
    marginTop: 18,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  loadingWord: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Error
  errorContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  errorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width * 0.78,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  errorIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default SearchScreen;
