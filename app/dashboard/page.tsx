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
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import { Project, Subtask, User } from "@/types/leaderboard.ts";
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";

import { useProject } from "../context/projectContext"; // ✅ Import the context

export default function Dashboard() {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setTeamModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  // const id = "addd061b-6883-4bab-a355-4479bf659623";

  const { currentProject, setCurrentProject } = useProject(); // ✅ Use context instead of useState
  const [UserProjects, setUserProjects] = useState<Project[]>([]);
  const [curr_user, setUser] = useState<User | null>(null);
  const project_id = useRef("");

  const isAuth = curr_user?.role !== "USER"; // Authentication status (should come from auth system)

  const [id,setId] = useState("addd061b-6883-4bab-a355-4479bf659623"); // User ID (should come from auth system)

  const { data: session, status } = useSession();
  console.log(status);
  if(status!="authenticated"){
    window.location.href = '/welcome';
  }
  
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
          const updatedCurrentProject = data.find((p) => p.id === currentProject.id);
          setCurrentProject(updatedCurrentProject || data[0]);
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
      .then((data: User) => setUser(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, [id, isAuth]);

  useEffect(() => {
    if (currentProject?.id) {
      project_id.current = currentProject.id;
    }
  }, [currentProject]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <WelcomeHeader
        user={curr_user}
        projectData={UserProjects}
        current={currentProject!}
        onProjectChange={handleCurrentProject}
      />

      {isAuth && (
        <div className="flex justify-end mb-6">
          {UserProjects.length !== 0 && (
            <Button onClick={() => setCreateProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create New Project
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <>
        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={() => setCreateProjectModalOpen(false)}
          onCreate={fetchProjects}
          currentUser={{ id, name: curr_user?.name || "Author" }}
        />
        <EditProjectManagementModal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} projectData={currentProject} />
        <EditTeamModal isOpen={isTeamModalOpen} onClose={() => setTeamModalOpen(false)} projectData={currentProject} isAuthor={isAuth} />
        <EditTaskTimelineModal
          isOpen={isTaskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          tasks={currentProject?.subtasks || []}
          projectId={currentProject?.id || ""}
        />
        <EditLearningMaterialsModal
          id={project_id.current}
          isOpen={isResourcesModalOpen}
          onClose={() => setResourcesModalOpen(false)}
          materials={currentProject?.projectResources || []}
          isAuthor={isAuth}
        />
      </>

      {/* Main Content */}
      {currentProject ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProjectOverview current={currentProject} />
            {isAuth && (
              <div className="flex items-center gap-4 mt-0 mb-4">
                <Button onClick={() => setProjectModalOpen(true)} className="bg-black text-white">
                  Edit Project Details
                </Button>
                <Button onClick={() => setTeamModalOpen(true)} className="bg-black text-white">
                  Edit Team
                </Button>
              </div>
            )}

            <ProjectTimeline tasks={currentProject.subtasks} />
            {isAuth && (
              <Button onClick={() => setTaskModalOpen(true)} className="mt-2 bg-black text-white">
                Edit Task Timeline
              </Button>
            )}
          </div>
          <div>
            <ProjectMessages />
            <ProjectResources resources={currentProject.projectResources} />
            {isAuth && (
              <Button onClick={() => setResourcesModalOpen(true)} className="mt-2 bg-black text-white">
                Edit Learning Materials
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          {UserProjects.length === 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
              <p className="text-gray-600 mb-6">
                {isAuth
                  ? "You haven't created any projects yet. Create your first project to get started."
                  : "You haven't been assigned to any projects yet. Please check back later."}
              </p>
              {isAuth && (
                <Button onClick={() => setCreateProjectModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            <Loader />
          )}
        </div>
      )}
    </div>
  );
}
