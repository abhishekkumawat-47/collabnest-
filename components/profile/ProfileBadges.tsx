"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaMedal } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const hardcodedUserId = '2487e9e1-b723-4cf9-84a6-cc04efae3365';

//Created a badge system for gamification

const badgeData = [
  { name: "Top Dawg!", variant: "outline", icon: <FaMedal />, description: "Ranked number 1 at contributor leaderboard" },
  { name: "ML Enthusiast!", variant: "outline", icon: <FaMedal />, description: "Completed a project related with AI/ML tags" },
  { name: "Dev Enthusiast", variant: "outline", icon: <FaMedal />, description: "Finished a development based project successfully" },
  { name: "Research Enthusiast", variant: "outline", icon: <FaMedal />, description: "Completed a project with research related tags." },
  { name: "Mentor Apprentice!", variant: "outline", icon: <FaMedal />, description: "Mentored a project" },
  { name: "Not so new!", variant: "outline", icon: <FaMedal />, description: "Applied in a project" },
  { name: "Novice", variant: "outline", icon: <FaMedal />, description: "Associated to a subtask" },
  { name: "Soldier", variant: "outline", icon: <FaMedal />, description: "Finished a project successfully" },
  { name: "Knight", variant: "outline", icon: <FaMedal />, description: "Finished 2 projects successfully" },
  { name: "Commander", variant: "outline", icon: <FaMedal />, description: "Finished 3 projects successfully" },
  { name: "Master", variant: "outline", icon: <FaMedal />, description: "Finished 5 projects successfully" },
  { name: "Grandmaster", variant: "outline", icon: <FaMedal />, description: "Finished 10 projects successfully" },
];

export const ProfileBadges = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/forProfile/byEmail/${session?.user?.email}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Error fetching user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const displayedBadges = showAll ? badgeData : badgeData.slice(0, 4);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {displayedBadges.map((badge) => (
          <div key={badge.name} className="flex flex-col items-center">
            <FaMedal size={40} className={`text-${badge.variant}`} />
            <Badge variant={badge.variant as any} className="mt-2">
              {badge.name}
            </Badge>
            <p className="text-center mt-1 text-sm">{badge.description}</p>
          </div>
        ))}
      </CardContent>
      {badgeData.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showAll ? 'View Less' : 'View More'}
        </button>
      )}
    </Card>
  );
};
