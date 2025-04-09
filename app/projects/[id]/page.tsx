"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");

        const data = await res.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProject();
  }, [id]);

  const handleSchedule = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    // Fixed meeting time: 6:00 PM
    const startDateTime = new Date(`${date}T18:00:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 minutes

    const res = await fetch("/api/schedule-meet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        subject: `Meeting about ${project.title}`,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Meeting Scheduled!\nJoin URL: ${data.meeting.joinWebUrl}`);
    } else {
      alert(`Failed: ${data.error}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Project Title */}
      <h1 className="text-3xl font-semibold mb-4">{project.title}</h1>

      {/* Project Details Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 p-4 border rounded-lg">
          <h2 className="text-xl font-medium">Project Details</h2>
          <p>
            <strong>Domain:</strong> {project.requirementTags.join(", ")}
          </p>
          <p>
            <strong>Mentor:</strong> {project.author?.name}
          </p>{" "}
          {/* Replace with actual mentor */}
          <p>
            <strong>Difficulty:</strong> {project.difficultyTag}
          </p>
          <p>
            <strong>Slots:</strong> {project.selectionCapacity}/
            {project.applicantCapacity}
          </p>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </div>

        {/* Subtasks Section */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-medium">Subtasks</h2>
          <ul className="mt-2 space-y-2">
            {project.subtasks.map((subtask: any, index: number) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  readOnly
                  className="mr-2"
                />
                {subtask.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Project Resources */}
      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-lg font-medium">Project Resources</h2>
        <ul className="mt-2 space-y-2">
          {project.projectResources.map((res: any, index: number) => (
            <li key={index}>
              <a
                href={res.url}
                target="_blank"
                className="text-blue-500 underline"
              >
                {res.name} ({res.type})
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Ask a Question */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-medium">Ask a Question</h2>
          <input
            type="text"
            placeholder="Your Question"
            className="w-full mt-2 p-2 border rounded"
          />
          <button className="mt-2 w-full bg-black text-white py-2 rounded">
            Ask
          </button>
        </div>

        {/* Schedule Meeting */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-medium">Schedule Meeting</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
          <button
            onClick={handleSchedule}
            className="mt-2 w-full bg-black text-white py-2 rounded"
          >
            Schedule
          </button>
        </div>
      </div>

      {/* Enroll Button */}
      <button className="mt-6 w-full bg-black text-white py-3 rounded">
        Enroll in Project
      </button>
    </div>
  );
}
