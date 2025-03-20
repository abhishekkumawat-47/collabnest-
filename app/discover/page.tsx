"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Loader from "@/components/Loader";

const Discovery = () => {
  type Status = "OPEN" | "CLOSED";
  type DifficultyTag = "INTERMEDIATE" | "BEGINNER" | "ADVANCED";

  interface Project {
    id: string;
    authorId: string;
    title: string;
    subheading: string;
    description: string;
    status: Status;
    deadlineToApply: string; // ISO date string
    deadlineToComplete: string; // ISO date string
    difficultyTag: DifficultyTag;
    requirementTags: string[];
    applicantCapacity: number;
    selectionCapacity: number;
    projectResources: any[];
    createdAt: string;
    updatedAt: string;
    subtasks: string[];
    applications: Application[];
  }

  interface Application {
    id: string;
    projectId: string;
    applicantId: string;
  }

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects/All_Project")
      .then((res) => res.json())
      .then((data) => {
        setAllProjects(data);
        setProjects(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const router = useRouter();

  async function applyForProject(
    projectId: string,
    action: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: "2be256eb-1646-4033-9d0e-2955647ba627",
          projectId: projectId,
          action,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Application failed");
      }

      alert("Project application successful!");
      fetchUpdatedProjects();
    } catch (error) {
      console.error("Error applying for project:", error);
      alert("Failed to apply for project. Please try again later.");
    }
  }

  async function fetchUpdatedProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/All_Project");
      const data = await res.json();
      setAllProjects(data);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching updated projects:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mx-5">
        <h1 className="text-3xl mt-5 mb-1 font-bold">
          Discover Recommended Projects
        </h1>
        <p className="text-muted-foreground">
          Browse projects from professors and research groups across various
          domains.
        </p>
        <Separator className="my-5" />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-4 mx-auto">
            {projects.map((project) => (
              <Card
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap mb-4">
                    {project.requirementTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-black text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-gray-600 text-sm space-y-2">
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Apply by:</span>{" "}
                      {new Date(project.deadlineToApply).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {project.applications
                    .map((member) => member.applicantId)
                    .includes("2be256eb-1646-4033-9d0e-2955647ba627") ? (
                    <Button
                      variant="outline"
                      className="bg-black text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        applyForProject(project.id, "withdraw");
                      }}
                    >
                      Withdraw
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-black text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        applyForProject(project.id, "apply");
                      }}
                    >
                      Apply
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Discovery;
