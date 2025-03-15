"use client";
import React, { useState, useEffect } from 'react';
"use client"

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from 'lucide-react';
import { auth } from '@/auth';

const hardcodedUserId = '2487e9e1-b723-4cf9-84a6-cc04efae3365';

export const ProfileHeader = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const session = await auth();
      console.log(session);
      
      // Set user data directly from the fetched session
      setUserName(session?.user?.name || "");
      setUserEmail(session?.user?.email || "");
    }
    catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    
    
    fetchUserDetails();
  }, []);

  fetchUserDetails();
  

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/forProfile/byUserId/${hardcodedUserId}`);
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
          <h1 className="text-2xl font-bold">{userName || "Loading..."}</h1>
          <p className="text-muted-foreground text-sm">Computer Science Engineering</p>
          <p className="text-sm text-muted-foreground">{userEmail || "Loading..."}</p>
          <h1 className="text-2xl font-bold">{userData?.name}</h1>
          <p className="text-muted-foreground text-sm">{userData?.department}</p>
          <p className="text-sm text-muted-foreground">{userData?.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};