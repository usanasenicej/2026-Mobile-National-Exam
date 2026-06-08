import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchWordDefinition } from '../services/dictionaryApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@LexiSearch:searchHistory';

const DictionaryContext = createContext(null);

export const DictionaryProvider = ({ children }) => {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentWord, setCurrentWord] = useState('');

  const persistSearchHistory = async (history) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save search history:', e);
    }
  };

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSearchHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    };
    loadSearchHistory();
  }, []);

  useEffect(() => {
    persistSearchHistory(searchHistory);
  }, [searchHistory]);

  const searchWord = useCallback(async (word) => {
    const trimmed = word?.trim();
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
      setSearchHistory((prev) => {
        const lower = trimmed.toLowerCase();
        if (prev.some((w) => w.toLowerCase() === lower)) {
          const filtered = prev.filter((w) => w.toLowerCase() !== lower);
          return [trimmed, ...filtered];
        }
        return [trimmed, ...prev];
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setWordData(null);
    setError(null);
    setCurrentWord('');
  }, []);

  const clearSearchHistory = useCallback(async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear search history:', e);
    }
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
        clearSearchHistory,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return ctx;
};
