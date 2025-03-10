import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from 'lucide-react';

export const ProfileHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/profile-placeholder.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Frank Ocean</h1>
          <p className="text-muted-foreground text-sm">Computer Science Engineering</p>
          <p className="text-sm text-muted-foreground">frank.ocean@college.edu</p>
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