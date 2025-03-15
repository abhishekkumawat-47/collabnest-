"use client";

import React, { useEffect, useState } from 'react';
import { LeaderboardHeader } from '@/components/leaderboard/LeaderboardHeader';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';   
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/fetchLeaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <LeaderboardHeader />
      <Card>
        <CardContent className="pt-6">
          <LeaderboardTable entries={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  );
}