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
} from 'react-native';
import { useDictionary } from '../context/DictionaryContext';
import { COLORS } from '../constants/colors';
import WordDetailCard from '../components/WordDetailCard';

const SearchScreen = ({ navigation }) => {
  const [inputWord, setInputWord] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  const { searchWord, loading, error, wordData, currentWord } = useDictionary();

  // ─── Input Validation ───────────────────────────────────────────────────────
  const validateInput = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setInputError('Search field cannot be empty.');
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
    if (inputError) setInputError(''); // clear error as user types
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
        {/* ── Hero banner ── */}
        {!wordData && !loading && !error && (
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>📖</Text>
            <Text style={styles.heroTitle}>LexiSearch</Text>
            <Text style={styles.heroSubtitle}>
              Discover word meanings, pronunciations, and usage examples instantly.
            </Text>
          </View>
        )}

        {/* ── Search bar ── */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.inputWrapper,
              inputError ? styles.inputWrapperError : null,
            ]}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Enter an English word…"
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
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Inline validation message */}
          {inputError ? (
            <Text style={styles.inputErrorText}>{inputError}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={loading}
            accessibilityLabel="Search button"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Looking up "{inputWord.trim()}"…</Text>
          </View>
        )}

        {/* ── API / network error ── */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>🔍</Text>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleSearch}
              accessibilityLabel="Retry search"
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Search
  searchSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  inputWrapperError: {
    borderColor: COLORS.errorRed,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  inputErrorText: {
    color: COLORS.errorRed,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  // Error
  errorContainer: {
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: COLORS.errorBg,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.errorRed,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    color: COLORS.errorRed,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SearchScreen;
