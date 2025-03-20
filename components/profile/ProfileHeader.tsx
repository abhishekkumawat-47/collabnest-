"use client"

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from 'lucide-react';



export const ProfileHeader = ({id}:{id:string}) => {

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/forProfile/byUserId/${id}`);
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

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userData?.picture}/>
          <AvatarFallback className="text-2xl">{userData?.name ? getInitials(userData.name) : 'CN'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userData?.name}</h1>
          <p className="text-muted-foreground text-sm">{userData?.role}</p>
          <p className="text-muted-foreground text-sm">{userData?.department}</p>
          <p className="text-sm text-muted-foreground">{userData?.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        
      </div>
    </div>
  );
};