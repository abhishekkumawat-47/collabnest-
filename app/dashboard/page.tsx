import React from "react";
import { Button } from "@/components/ui/button";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { ProjectMessages } from "@/components/dashboard/ProjectMessages";
import { ProjectResources } from "@/components/dashboard/ProjectResources";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

export default function Dashboard() {
  return (
    
    <div className="container mx-auto py-8 px-4 md:px-8">
        <WelcomeHeader />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            
            <ProjectOverview />
            <ProjectTimeline />
          </div>
          <div>
            <ProjectMessages />
            <ProjectResources />
          </div>
        </div>
      </div>
    
  );
}
