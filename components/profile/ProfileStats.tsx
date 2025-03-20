"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, BookOpen, Target } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Loader } from './Loader'; // Import the Loader component

export const ProfileStats = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session?.user?.email]);

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Loader center text="Loading statistics..." />
    </div>
  );
  
  if (error) return <p className="text-red-500">{error}</p>;

  const stats = [
    {
      icon: Trophy,
      title: "Total Projects",
      value: (userData?.projectsParticipated?.length || 0) + (userData?.projectsCreated?.length || 0)
    },
    {
      icon: Star,
      title: "Total Applications",
      value: userData?.applications?.length || 0
    },
    {
      icon: Trophy,
      title: "Contributor Rating",
      value: userData?.rating || "N/A",
      color: "text-yellow-500"
    }
  ];
  
  const ratingData = [
    {
      icon: BookOpen,
      title: "Beginner projects",
      value: 0,
      color: "text-yellow-500"
    },
    {
      icon: Star,
      title: "Intermediate Projects",
      value: 0,
      color: "text-blue-500"
    },
    {
      icon: Target,
      title: "Advanced Projects",
      value: 0,
      color: "text-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}

      {ratingData.map((rating) => (
        <Card key={rating.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{rating.title}</CardTitle>
            <rating.icon className={`h-4 w-4 ${rating.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rating.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};