import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, BookOpen,Target } from 'lucide-react';


export const ProfileStats = () => {
  const stats = [
    { 
      icon: Trophy, 
      title: "Total Projects", 
      value: 12 
    },
    { 
      icon: Star, 
      title: "Completed Tasks", 
      value: 45 
    },
    { 
      icon: BookOpen, 
      title: "Active Domains", 
      value: 4 
    }
  ];

  const ratingData = [
    { 
      icon: Trophy, 
      title: "Contributor Rating", 
      value: 1447,
      color: "text-yellow-500"
    },
    { 
      icon: Star, 
      title: "Project Score", 
      value: 850,
      color: "text-blue-500"
    },
    { 
      icon: Target, 
      title: "Domain Expertise", 
      value: 1280,
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