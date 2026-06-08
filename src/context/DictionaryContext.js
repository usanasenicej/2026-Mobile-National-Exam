import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWordDefinition } from '../services/dictionaryApi';

const DictionaryContext = createContext(null);

const STORAGE_KEY = '@LexiSearch:searchHistory';

/**
 * Provides dictionary search state and search history to the entire app.
 * Search history is persisted using AsyncStorage.
 */
export const DictionaryProvider = ({ children }) => {
  const [wordData, setWordData] = useState(null);       // Current API result
  const [loading, setLoading] = useState(false);        // Loading indicator flag
  const [error, setError] = useState(null);             // Error message string
  const [searchHistory, setSearchHistory] = useState([]); // Searched words list
  const [currentWord, setCurrentWord] = useState('');   // Last searched word
  const [historyLoading, setHistoryLoading] = useState(true); // History loading state

  // Load search history from AsyncStorage on mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory));
        }
      } catch (err) {
        console.error('Failed to load search history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadSearchHistory();
  }, []);

  // Save search history to AsyncStorage whenever it changes
  const persistSearchHistory = useCallback(async (history) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  }, []);

  /**
   * Searches for a word via the API and updates all relevant state.
   * Adds the word to search history (no duplicates, case-insensitive).
   * @param {string} word
   */
  const searchWord = useCallback(async (word) => {
    const trimmed = word?.trim();

    // Input validation
    if (!trimmed) {
      setError('Please enter a word to search.');
      return;
    }

    setLoading(true);
    setError(null);
    setWordData(null);
    setCurrentWord(trimmed);

    try {
      const data = await fetchWordDefinition(trimmed);
      setWordData(data);

      // Add to history — prevent duplicates (case-insensitive)
      setSearchHistory((prev) => {
        const lower = trimmed.toLowerCase();
        if (prev.some((w) => w.toLowerCase() === lower)) {
          // Move existing word to front
          const filtered = prev.filter((w) => w.toLowerCase() !== lower);
          const updated = [trimmed, ...filtered];
          persistSearchHistory(updated);
          return updated;
        }
        const updated = [trimmed, ...prev];
        persistSearchHistory(updated);
        return updated; // newest first
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  }, [persistSearchHistory]);

  /**
   * Clears all current result and error state (used when navigating away).
   */
  const clearResults = useCallback(() => {
    setWordData(null);
    setError(null);
    setCurrentWord('');
  }, []);

  /**
   * Clears the entire search history.
   */
  const clearSearchHistory = useCallback(async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  }, []);

  /**
   * Removes a specific word from search history.
   */
  const removeFromSearchHistory = useCallback(async (wordToRemove) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((w) => w.toLowerCase() !== wordToRemove.toLowerCase());
      persistSearchHistory(updated);
      return updated;
    });
  }, [persistSearchHistory]);

  return (
    <DictionaryContext.Provider
      value={{
        wordData,
        loading,
        error,
        searchHistory,
        currentWord,
        historyLoading,
        searchWord,
        clearResults,
        clearSearchHistory,
        removeFromSearchHistory,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

/**
 * Custom hook for consuming DictionaryContext.
 */
export const useDictionary = () => {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return ctx;
};