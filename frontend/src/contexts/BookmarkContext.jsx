import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookmarkAPI } from '../services/bookmarkService';
import { useAuth } from './AuthContext';

// Create BookmarkContext
const BookmarkContext = createContext();

// Custom hook to use bookmark context
export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used inside BookmarkProvider');
  }
  return context;
}

export const BookmarkProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookmarkedAlumni, setBookmarkedAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Clear bookmarks when user logs out
  useEffect(() => {
    if (!user) {
      setBookmarkedAlumni([]);
      setInitialized(false);
      setError(null);
    }
  }, [user]);

  /**
   * Fetch all bookmarks from API - now called only on demand
   */
  const fetchBookmarks = async () => {
    if (!user) {
      console.log('No user found, skipping bookmark fetch');
      return;
    }

    // Don't fetch again if already initialized
    if (initialized) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await bookmarkAPI.getBookmarks();
      if (result.success) {
        // Extract alumni IDs from the bookmark data
        const alumniIds = result.data.map(bookmark => bookmark.alumniId || bookmark.userId);
        setBookmarkedAlumni(alumniIds);
        setInitialized(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error('Bookmark fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if an alumni is bookmarked
   */
  const isBookmarked = (alumniId) => {
    return bookmarkedAlumni.includes(alumniId);
  };

  /**
   * Toggle bookmark status for an alumni
   */
  const toggleBookmark = async (alumniId) => {
    if (!user) {
      return { success: false, message: 'Please log in to bookmark alumni' };
    }

    const isCurrentlyBookmarked = isBookmarked(alumniId);
    
    // Optimistic update
    if (isCurrentlyBookmarked) {
      setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));
    } else {
      setBookmarkedAlumni(prev => [...prev, alumniId]);
    }

    try {
      const result = await bookmarkAPI.toggleBookmark(alumniId, isCurrentlyBookmarked);
      
      if (!result.success) {
        // Revert optimistic update on failure
        if (isCurrentlyBookmarked) {
          setBookmarkedAlumni(prev => [...prev, alumniId]);
        } else {
          setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));
        }
      }
      
      return result;
    } catch (err) {
      // Revert optimistic update on error
      if (isCurrentlyBookmarked) {
        setBookmarkedAlumni(prev => [...prev, alumniId]);
      } else {
        setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));
      }
      
      return { success: false, message: 'Network error occurred' };
    }
  };

  /**
   * Add bookmark
   */
  const addBookmark = async (alumniId) => {
    if (!user) {
      return { success: false, message: 'Please log in to bookmark alumni' };
    }

    if (isBookmarked(alumniId)) {
      return { success: true, message: 'Alumni already bookmarked' };
    }

    // Optimistic update
    setBookmarkedAlumni(prev => [...prev, alumniId]);

    try {
      const result = await bookmarkAPI.addBookmark(alumniId);
      
      if (!result.success) {
        // Revert optimistic update on failure
        setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));
      }
      
      return result;
    } catch (err) {
      // Revert optimistic update on error
      setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));
      return { success: false, message: 'Network error occurred' };
    }
  };

  /**
   * Remove bookmark
   */
  const removeBookmark = async (alumniId) => {
    if (!user) {
      return { success: false, message: 'Please log in to manage bookmarks' };
    }

    if (!isBookmarked(alumniId)) {
      return { success: true, message: 'Alumni not bookmarked' };
    }

    // Optimistic update
    setBookmarkedAlumni(prev => prev.filter(id => id !== alumniId));

    try {
      const result = await bookmarkAPI.removeBookmark(alumniId);
      
      if (!result.success) {
        // Revert optimistic update on failure
        setBookmarkedAlumni(prev => [...prev, alumniId]);
      }
      
      return result;
    } catch (err) {
      // Revert optimistic update on error
      setBookmarkedAlumni(prev => [...prev, alumniId]);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const value = {
    bookmarkedAlumni,
    loading,
    error,
    initialized,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    fetchBookmarks,
    bookmarkCount: bookmarkedAlumni.length
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};
