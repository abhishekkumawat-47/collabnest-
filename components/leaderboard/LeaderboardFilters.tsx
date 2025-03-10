import React from 'react';
import { Button } from "@/components/ui/button";

export const LeaderboardFilters = () => {
  const filters = ['Domain', 'Department', 'Duration', 'Time Commitment'];

  return (
    <div className="flex space-x-2 flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Button key={filter} variant="outline">
          {filter}
        </Button>
      ))}
    </div>
  );
};