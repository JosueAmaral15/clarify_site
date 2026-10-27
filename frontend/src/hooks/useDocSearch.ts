import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { createSearchIndex } from '../data/documentationData';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  icon: string;
  score?: number;
}

export function useDocSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  // Create Fuse.js instance with search index
  const fuse = useMemo(() => {
    const searchIndex = createSearchIndex();
    return new Fuse(searchIndex, {
      keys: ['title', 'searchText'],
      threshold: 0.3, // 0 = perfect match, 1 = match anything
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, []);

  // Perform search
  const results: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const fuseResults = fuse.search(searchQuery);
    return fuseResults.slice(0, 8).map(result => ({
      id: result.item.id,
      title: result.item.title,
      url: result.item.url,
      icon: result.item.icon,
      score: result.score
    }));
  }, [searchQuery, fuse]);

  return {
    searchQuery,
    setSearchQuery,
    results,
    hasResults: results.length > 0,
  };
}
