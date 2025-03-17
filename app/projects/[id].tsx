import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { Calendar } from "lucide-react";
import Loader from "@/components/Loader";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  interface Project {
    title: string;
    subheading: string;
    description: string;
    status: string;
    difficultyTag: string;
    deadlineToApply: string;
    deadlineToComplete: string;
    applicantCapacity: number;
    selectionCapacity: number;
    requirementTags: string[];
    projectResources: { name: string; url: string }[];
    author?: { name: string };
    members: { id: string; name: string }[];
    subtasks: { id: string; title: string }[];
  }

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  if (!project) return null;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
          <CardDescription>{project.subheading}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mt-4">{project.description}</p>
          <div className="mt-4">
            <span className="text-sm font-semibold">Status:</span> {project.status}
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Difficulty:</span> {project.difficultyTag}
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Deadline to Apply:</span> {formatDate(project.deadlineToApply)}
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Deadline to Complete:</span> {formatDate(project.deadlineToComplete)}
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Applicant Capacity:</span> {project.applicantCapacity}
          </div>
          <div className="mt-2">
            <span className="text-sm font-semibold">Selection Capacity:</span> {project.selectionCapacity}
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Requirement Tags</h3>
            <ul className="list-disc ml-6">
              {project.requirementTags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Project Resources</h3>
            <ul className="list-disc ml-6">
              {project.projectResources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Author</h3>
            <p>{project.author?.name}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Members</h3>
            <ul className="list-disc ml-6">
              {project.members.map((member) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Subtasks</h3>
            <ul className="list-disc ml-6">
              {project.subtasks.map((subtask) => (
                <li key={subtask.id}>{subtask.title}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}