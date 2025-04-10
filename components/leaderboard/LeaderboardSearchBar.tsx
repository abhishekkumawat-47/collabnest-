import React from 'react';
import { Input } from "@/components/ui/input";
import { useLeaderboardContext } from '@/app/leaderboard/page';

export const LeaderboardSearchBar = () => {
  const { searchQuery, setSearchQuery } = useLeaderboardContext();
  return (
    <div className="mb-4">
      <Input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name..." 
        className="max-w-md"
      />
    </div>
  );
};