import axios from 'axios';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Fetches word data from the Free Dictionary API.
 * @param {string} word - The English word to look up.
 * @returns {Promise<Array>} - Resolves with the array of word entry objects.
 * @throws Will throw an error with a user-friendly message on failure.
 */
export const fetchWordDefinition = async (word) => {
  if (!word || word.trim() === '') {
    throw new Error('Please enter a word to search.');
  }

  const trimmedWord = word.trim().toLowerCase();

  try {
    const response = await axios.get(`${BASE_URL}/${encodeURIComponent(trimmedWord)}`, {
      timeout: 10000, // 10 second timeout
    });

    // Axios throws for non-2xx by default, but we guard anyway
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(`No results found for "${word}".`);
    }

    return response.data;
  } catch (error) {
    // Axios error with a response means the server replied (e.g. 404)
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(`"${word}" was not found in the dictionary.`);
      }
      throw new Error(
        `Server error (${error.response.status}). Please try again later.`
      );
    }

    // No response — network issue or timeout
    if (error.request || error.code === 'ECONNABORTED') {
      throw new Error(
        'Network error. Please check your internet connection and try again.'
      );
    }

    // Re-throw validation errors or already formatted messages
    throw error;
  }
};
