"use client"
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import EndButton from "@/components/ui/end-button";
import {ProjectOverview} from "@/components/dashboard/ProjectOverview";
import {ProjectTimeline} from "@/components/dashboard/ProjectTimeline";
import {ProjectMessages} from "@/components/dashboard/ProjectMessages";
import {ProjectResources} from "@/components/dashboard/ProjectResources";
import {WelcomeHeader} from "@/components/dashboard/WelcomeHeader";
import EditProjectManagementModal from "@/components/modals/EditProjectManagementModal";
import EditTaskTimelineModal from "@/components/modals/EditTaskTimelineModal";
import EditLearningMaterialsModal from "@/components/modals/EditLearningMaterialsModal";


import EndProjectModal from "@/components/modals/EndProjectModal";


import Loader from "@/components/Loader";

export default function Dashboard() {
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isResourcesModalOpen, setResourcesModalOpen] = useState(false);

  const [isEndProjectModalOpen, setEndProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      .then((data: Project[]) => {
        setUserProjects(data);
        if (data.length > 0) {
          if (currentProject) {
            const updatedCurrentProject = data.find(
              (p) => p.id === currentProject.id
            );
            setCurrentProject(updatedCurrentProject || data[0]);
          } else {
            setCurrentProject(data[0]);
          }
        }
      })
      .catch((err) => console.log(err));
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
  }, [id]);

  const project_id = useRef("");
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


  const onEndProject = async (ratings: { [userId: string]: number }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/forDashboard/endProject/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: currentProject?.id,
          ratings,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end project: ${response.statusText}`);
      }

      // Fetch the updated project data to verify the status update
      const updatedProjectResponse = await fetch(`/api/forDashboard/byUserId/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedProjects = await updatedProjectResponse.json();
      const updatedCurrentProject = updatedProjects.find(
        (project: Project) => project.id === currentProject?.id
      );

      // Update the project status in the UI
      if (updatedCurrentProject) {
        console.log('Updated Project Status:', updatedCurrentProject.status); // Log the updated status
        setCurrentProject(updatedCurrentProject);
        setUserProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedCurrentProject.id ? updatedCurrentProject : project
          )
        );
      }

      setEndProjectModalOpen(false);
    } catch (error) {
      console.error("Error ending project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onIssueCertificate = () => {
    // Implement the logic to issue certificates
    console.log('Issuing certificates for project:', currentProject?.id);
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
          <EndProjectModal
            isOpen={isEndProjectModalOpen}
            onClose={() => setEndProjectModalOpen(false)}
            onEndProject={onEndProject}
            contributors={currentProject.members.map((member) => ({
              id: member.user.id,
              name: member.user.name,
            }))}
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
          {currentProject.status !== "CLOSED" && (
            <>
              <Button
                onClick={() => setTaskModalOpen(true)}
                className='mt-2 bg-black text-white'>
                Edit Task Timeline
              </Button>
              <EndButton
                onClick={() => setEndProjectModalOpen(true)}
                className='mt-2 bg-red-600 text-white'
                disabled={isLoading}
              >
                {isLoading ? "Ending Project..." : "End Project"}
              </EndButton>
            </>
          )}
          {currentProject.status === "CLOSED" && (
            <>
              <Button className='mt-2 bg-gray-500 text-white' disabled>
                Closed
              </Button>
              <Button
                onClick={onIssueCertificate}
                className='mt-2 ml-2 bg-blue-500 text-white'>
                Issue Certificate
              </Button>
            </>
          )}
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