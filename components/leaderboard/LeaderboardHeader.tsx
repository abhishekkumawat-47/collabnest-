import React from 'react';
import { LeaderboardSearchBar } from '@/components/leaderboard/LeaderboardSearchBar';
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters';

export const LeaderboardHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
      <p className="text-muted-foreground mb-4">
        Discover top contributors among fellow students across all domains
      </p>
      
      <LeaderboardSearchBar />
      {/* <LeaderboardFilters /> */}
    </div>
  );
};

