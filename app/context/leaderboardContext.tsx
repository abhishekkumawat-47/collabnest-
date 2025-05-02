"use client";
import React, { createContext, useContext } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';

// Contexts
export const LeaderboardContext = createContext<{
  filteredEntries: LeaderboardEntry[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}>({
  filteredEntries: [],
  searchQuery: "",
  setSearchQuery: () => {},
});

// Custom hook for consuming the context
export const useLeaderboardContext = () => useContext(LeaderboardContext);
