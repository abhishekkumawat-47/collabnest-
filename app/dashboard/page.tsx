"use client"; // Ensures React hooks work in Next.js
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { ProjectMessages } from "@/components/dashboard/ProjectMessages";
import { ProjectResources } from "@/components/dashboard/ProjectResources";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

import EditProjectManagementModal from "@/components/modals/EditProjectManagementModal";
import EditTaskTimelineModal from "@/components/modals/EditTaskTimelineModal";
import EditLearningMaterialsModal from "@/components/modals/EditLearningMaterialsModal";

export default function Dashboard() {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);

  // Sample data for the modals
  const projectData = {
    title: "Autonomous Robot Navigation",
    description: "Developing autonomous navigation for robots using Deep RL techniques.",
    tags: ["AI", "Robotics", "Deep Learning"],
    deadline: "March 15, 2025",
  };

  const taskData = [
    { id: 1, title: "Research and Planning", dueDate: "March 15, 2025" },
  ];

  const projectResourcesData = [
    { id: 1, name: "Deep RL Navigation Tutorial", type: "PDF", link: "resource1.pdf" },
    { id: 2, name: "API Documentation", type: "Link", link: "https://api.docs" },
  ];

  const onSaveProject = (updatedProject: any) => {
    console.log("Project Updated:", updatedProject);
    setProjectModalOpen(false);
  };

  const onSaveTask = (updatedTask: any) => {
    console.log("Task Updated:", updatedTask);
    setTaskModalOpen(false);
  };

  const onSaveResources = (updatedResources: any) => {
    console.log("Resources Updated:", updatedResources);
    setResourcesModalOpen(false);
  };

  return (
    
    <div className="container mx-auto py-8 px-4 md:px-8">
      <WelcomeHeader />

      {/* Modals */}
      <EditProjectManagementModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setProjectModalOpen(false)} 
        projectData={projectData}
        onSave={onSaveProject}
      />
      <EditTaskTimelineModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setTaskModalOpen(false)}
        tasks={taskData}  
        onSave={onSaveTask} 
      />
      <EditLearningMaterialsModal 
        isOpen={isResourcesModalOpen} 
        onClose={() => setResourcesModalOpen(false)}
        materials={projectResourcesData}  
        onSave={onSaveResources} 
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProjectOverview />
          <Button 
            onClick={() => setProjectModalOpen(true)} 
            className="mt-0 mb-4 bg-black text-white"
          >
            Edit Project Details
          </Button>

          <ProjectTimeline />
          <Button 
            onClick={() => setTaskModalOpen(true)} 
            className="mt-2 bg-black text-white"
          >
            Edit Task Timeline
          </Button>
        </div>
        <div>
          <ProjectMessages />
          <ProjectResources />
          <Button 
            onClick={() => setResourcesModalOpen(true)} 
            className="mt-2 bg-black text-white"
          >
            Edit Learning Materials
          </Button>
        </div>
      </div>
    </div>
  );
}

