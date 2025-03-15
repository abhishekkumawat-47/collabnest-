"use client"; // Ensures React hooks work in Next.js
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { ProjectMessages } from "@/components/dashboard/ProjectMessages";
import { ProjectResources } from "@/components/dashboard/ProjectResources";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

import EditProjectManagementModal from "@/components/modals/EditProjectManagementModal";
import EditTaskTimelineModal from "@/components/modals/EditTaskTimelineModal";
import EditLearningMaterialsModal from "@/components/modals/EditLearningMaterialsModal";
import { Project, ProjectMember, Subtask, User } from "@/types/leaderboard.ts";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);
  const id = "1c1d2c2d-7d46-4cbf-8d4a-93e9e97e5600"; //user id
  const [UserProjects, setUserProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [curr_user, setUser] = useState<User | null>(null);
  const handleCurrentProject = (project: Project) => {
    setCurrentProject(project);
  };

  const fetchProjects = () => {
    fetch(`/api/forDashboard/byUserId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: { userProjects: Project[]; user: User }) => {
        const { userProjects, user } = data;
        setUser(user);
        setUserProjects(userProjects);
        if (userProjects.length > 0) {
          // If we already have a current project, find and update it
          if (currentProject) {
            const updatedCurrentProject = userProjects.find(
              (p) => p.id === currentProject.id
            );
            if (updatedCurrentProject) {
              setCurrentProject(updatedCurrentProject);
            } else {
              setCurrentProject(userProjects[0]);
            }
          } else {
            setCurrentProject(userProjects[0]);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const project_id = useRef("");
  useEffect(() => {
    if (currentProject?.id) {
      project_id.current = currentProject.id;
    }
  }, [currentProject]);

  // In page.tsx - Update the onSaveProject function
  const onSaveProject = async ({
    project_id,
    title,
    description,
    tags,
    deadline,
  }: {
    project_id: string;
    title: string;
    description: string;
    tags: string[];
    deadline: string;
  }) => {
    try {
      const response = await fetch(`/api/forDashboard/updateProject/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: project_id, // Changed from project_id to id to match controller
          title,
          description,
          requirementTags: tags, // Changed from tags to requirementTags to match controller
          deadlineToComplete: deadline,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.statusText}`);
      }

      // Update the UI immediately without a full page refresh
      if (currentProject && currentProject.id === project_id) {
        const updatedProject = {
          ...currentProject,
          title,
          description,
          requirementTags: tags,
          deadlineToComplete: deadline,
        };

        // Update the current project
        setCurrentProject(updatedProject);

        // Update the project in the UserProjects array
        setUserProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === project_id ? updatedProject : project
          )
        );
      }

      setProjectModalOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const onSaveTask = (updatedTasks: Subtask[]) => {
    // Update the current project with the updated tasks
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        subtasks: updatedTasks,
      };

      // Update the current project
      setCurrentProject(updatedProject);

      // Update the project in the UserProjects array
      setUserProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === currentProject.id ? updatedProject : project
        )
      );
    }
  };

  const onSaveResources = () => {
    // Refresh project data after resources are updated

    fetchProjects();
  };

  return currentProject && curr_user ? (
    <div className='container mx-auto py-8 px-4 md:px-8'>
      <WelcomeHeader
        current_user={curr_user}
        projectData={UserProjects}
        current={currentProject}
        onProjectChange={handleCurrentProject}
      />

      {
        <>
          <EditProjectManagementModal
            isOpen={isProjectModalOpen}
            onClose={() => setProjectModalOpen(false)}
            projectData={currentProject}
            onSave={onSaveProject}
          />
          <EditTaskTimelineModal
            isOpen={isTaskModalOpen}
            onClose={() => setTaskModalOpen(false)}
            tasks={currentProject ? currentProject.subtasks : []}
            projectId={currentProject ? currentProject.id : ""}
            onSave={onSaveTask}
          />
          <EditLearningMaterialsModal
            id={project_id.current}
            isOpen={isResourcesModalOpen}
            onClose={() => setResourcesModalOpen(false)}
            materials={currentProject ? currentProject.projectResources : []}
            onSave={onSaveResources}
          />
        </>
      }

      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <ProjectOverview current={currentProject} />
          <Button
            onClick={() => setProjectModalOpen(true)}
            className='mt-0 mb-4 bg-black text-white'>
            Edit Project Details
          </Button>

          <ProjectTimeline
            tasks={currentProject ? currentProject.subtasks : []}
          />
          <Button
            onClick={() => setTaskModalOpen(true)}
            className='mt-2 bg-black text-white'>
            Edit Task Timeline
          </Button>
        </div>
        <div>
          <ProjectMessages />
          <ProjectResources resources={currentProject.projectResources} />
          <Button
            onClick={() => setResourcesModalOpen(true)}
            className='mt-2 bg-black text-white'>
            Edit Learning Materials
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
