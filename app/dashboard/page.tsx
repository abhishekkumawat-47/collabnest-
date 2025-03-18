"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { ProjectMessages } from "@/components/dashboard/ProjectMessages";
import { ProjectResources } from "@/components/dashboard/ProjectResources";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

import EditProjectManagementModal from "@/components/modals/EditProjectManagementModal";
import EditTeamModal from "@/components/modals/EditTeamModal";
import EditTaskTimelineModal from "@/components/modals/EditTaskTimelineModal";
import EditLearningMaterialsModal from "@/components/modals/EditLearningMaterialsModal";
import { Project, Subtask, User, Role } from "@/types/leaderboard.ts";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);
  const id = "addd061b-6883-4bab-a355-4479bf659623"; // User ID (should come from auth system)
  const [UserProjects, setUserProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [curr_user, setUser] = useState<User | null>(null);
  const project_id = useRef("");
  // const isAuth = false; // Authentication status (should come from auth system)
  const isAuth = curr_user?.role !== "USER";
  const handleCurrentProject = (project: Project) => {
    setCurrentProject(project);
  };

  const fetchProjects = async () => {
    try {
      const endpoint = isAuth
        ? `/api/forDashboard/byAuthor/${id}`
        : `/api/forDashboard/byUserId/${id}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data: Project[] = await response.json();
      setUserProjects(data);

      if (data.length > 0) {
        if (currentProject) {
          const updatedCurrentProject = data.find(
            (p) => p.id === currentProject.id
          );
          if (updatedCurrentProject) {
            setCurrentProject(updatedCurrentProject);
          } else {
            setCurrentProject(data[0]);
          }
        } else {
          setCurrentProject(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchUser = () => {
    fetch(`/api/forDashboard/userDetails/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: User) => {
        setUser(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, [id, isAuth]); // Added isAuth as a dependency

  useEffect(() => {
    if (currentProject?.id) {
      project_id.current = currentProject.id;
    }
  }, [currentProject]);

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
          id: project_id,
          title,
          description,
          requirementTags: tags,
          deadlineToComplete: deadline,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.statusText}`);
      }

      if (currentProject && currentProject.id === project_id) {
        const updatedProject = {
          ...currentProject,
          title,
          description,
          requirementTags: tags,
          deadlineToComplete: deadline,
        };

        setCurrentProject(updatedProject);
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
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        subtasks: updatedTasks,
      };

      setCurrentProject(updatedProject);
      setUserProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === currentProject.id ? updatedProject : project
        )
      );
    }
  };

  const onSaveResources = () => {
    fetchProjects();
  };

  return currentProject ? (
    <div className='container mx-auto py-8 px-4 md:px-8'>
      <WelcomeHeader
        user={curr_user}
        projectData={UserProjects}
        current={currentProject}
        onProjectChange={handleCurrentProject}
      />

      {/* Modals */}
      <>
        <EditProjectManagementModal
          isOpen={isProjectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          projectData={currentProject}
          onSave={onSaveProject}
        />
        <EditTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          projectData={currentProject}
          isAuthor={isAuth}
        />
        <EditTaskTimelineModal
          isOpen={isTaskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          tasks={currentProject.subtasks}
          projectId={currentProject.id}
          onSave={onSaveTask}
        />
        <EditLearningMaterialsModal
          id={project_id.current}
          isOpen={isResourcesModalOpen}
          onClose={() => setResourcesModalOpen(false)}
          materials={currentProject.projectResources}
          onSave={onSaveResources}
          isAuthor={isAuth}
        />
      </>

      {/* Main Content */}
      <div className='grid md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <ProjectOverview current={currentProject} />
          <div className='flex items-center gap-4 mt-0 mb-4'>
            {isAuth ? (
              <>
                <Button
                  onClick={() => setProjectModalOpen(true)}
                  className='bg-black text-white'>
                  Edit Project Details
                </Button>
                <Button
                  onClick={() => setTeamModalOpen(true)}
                  className='bg-black text-white'>
                  Edit Team
                </Button>
              </>
            ) : null}
          </div>

          <ProjectTimeline tasks={currentProject.subtasks} />
          {isAuth ? (
            <Button
              onClick={() => setTaskModalOpen(true)}
              className='mt-2 bg-black text-white'>
              Edit Task Timeline
            </Button>
          ) : null}
        </div>
        <div>
          <ProjectMessages />
          <ProjectResources resources={currentProject.projectResources} />
          {isAuth ? (
            <Button
              onClick={() => setResourcesModalOpen(true)}
              className='mt-2 bg-black text-white'>
              Edit Learning Materials
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
