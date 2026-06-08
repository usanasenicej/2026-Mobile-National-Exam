import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchWordDefinition } from '../services/dictionaryApi';

const DictionaryContext = createContext(null);

/**
 * Provides dictionary search state and search history to the entire app.
 */
export const DictionaryProvider = ({ children }) => {
  const [wordData, setWordData] = useState(null);       // Current API result
  const [loading, setLoading] = useState(false);        // Loading indicator flag
  const [error, setError] = useState(null);             // Error message string
  const [searchHistory, setSearchHistory] = useState([]); // Searched words list
  const [currentWord, setCurrentWord] = useState('');   // Last searched word

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
          return prev;
        }
        return [trimmed, ...prev]; // newest first
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clears all current result and error state (used when navigating away).
   */
  const clearResults = useCallback(() => {
    setWordData(null);
    setError(null);
    setCurrentWord('');
  }, []);

  return (
    <DictionaryContext.Provider
      value={{
        wordData,
        loading,
        error,
        searchHistory,
        currentWord,
        searchWord,
        clearResults,
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
