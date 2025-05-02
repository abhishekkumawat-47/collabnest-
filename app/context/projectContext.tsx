"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Project } from "@/types/leaderboard.ts";

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
