// Utility functions for managing alumni bookmarks in localStorage

const BOOKMARKS_KEY = 'alumni_bookmarks';

/**
 * Get all bookmarked alumni IDs from localStorage
 * @returns {number[]} Array of alumni user IDs
 */
export const getBookmarkedAlumni = () => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

/**
 * Add an alumni to bookmarks
 * @param {number} alumniId - The alumni user ID
 * @returns {number[]} Updated bookmarks array
 */
export const addBookmark = (alumniId) => {
  try {
    const bookmarks = getBookmarkedAlumni();
    if (!bookmarks.includes(alumniId)) {
      const updatedBookmarks = [...bookmarks, alumniId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    }
    return bookmarks;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return getBookmarkedAlumni();
  }
};

/**
 * Remove an alumni from bookmarks
 * @param {number} alumniId - The alumni user ID
 * @returns {number[]} Updated bookmarks array
 */
export const removeBookmark = (alumniId) => {
  try {
    const bookmarks = getBookmarkedAlumni();
    const updatedBookmarks = bookmarks.filter(id => id !== alumniId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    return updatedBookmarks;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return getBookmarkedAlumni();
  }
};

/**
 * Check if an alumni is bookmarked
 * @param {number} alumniId - The alumni user ID
 * @returns {boolean} True if bookmarked
 */
export const isBookmarked = (alumniId) => {
  try {
    const bookmarks = getBookmarkedAlumni();
    return bookmarks.includes(alumniId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};

/**
 * Toggle bookmark status for an alumni
 * @param {number} alumniId - The alumni user ID
 * @returns {boolean} New bookmark status
 */
export const toggleBookmark = (alumniId) => {
  try {
    if (isBookmarked(alumniId)) {
      removeBookmark(alumniId);
      return false;
    } else {
      addBookmark(alumniId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};
