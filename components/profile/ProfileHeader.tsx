"use client";
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from 'lucide-react';
import { auth } from '@/auth';

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
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/profile-placeholder.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userName || "Loading..."}</h1>
          <p className="text-muted-foreground text-sm">Computer Science Engineering</p>
          <p className="text-sm text-muted-foreground">{userEmail || "Loading..."}</p>
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