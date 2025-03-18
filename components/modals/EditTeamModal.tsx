"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Project } from "@/types/leaderboard.ts";
import { Check, X } from "lucide-react";

interface Application {
  id: string;
  applicant: {
    name: string;
    email: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  dateOfApplication: string;
}

const EditTeamModal = ({
  isOpen,
  onClose,
  projectData,
  isAuthor,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectData: Project;
  isAuthor: boolean;
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]); // Track IDs of accepted applications
  const [rejectedIds, setRejectedIds] = useState<string[]>([]); // Track IDs of rejected applications

  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when the modal is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Fetch pending applications for the project
  useEffect(() => {
    if (isOpen && projectData?.id && isAuthor) {
      fetchApplications();
    }
  }, [isOpen, projectData?.id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pending/${projectData.id}`);
      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting an application
  const handleAccept = (applicationId: string) => {
    // If already accepted, toggle off
    if (acceptedIds.includes(applicationId)) {
      setAcceptedIds((prev) => prev.filter((id) => id !== applicationId));
    }
    // If already rejected, switch from rejected to accepted
    else {
      // Add to accepted list
      setAcceptedIds((prev) => [...prev, applicationId]);
      // Remove from rejected list if present
      setRejectedIds((prev) => prev.filter((id) => id !== applicationId));
    }
  };

  // Handle rejecting an application
  const handleReject = (applicationId: string) => {
    // If already rejected, toggle off
    if (rejectedIds.includes(applicationId)) {
      setRejectedIds((prev) => prev.filter((id) => id !== applicationId));
    }
    // If already accepted, switch from accepted to rejected
    else {
      // Add to rejected list
      setRejectedIds((prev) => [...prev, applicationId]);
      // Remove from accepted list if present
      setAcceptedIds((prev) => prev.filter((id) => id !== applicationId));
    }
  };

  // Save changes and send PUT request
  const saveChanges = async () => {
    try {
      setLoading(true);
      setError("");

      // Send PUT request with accepted and rejected IDs
      const response = await fetch(`/api/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptedIds, rejectedIds }),
      });

      if (!response.ok)
        throw new Error("Failed to update application statuses");

      // Clear the accepted and rejected IDs
      setAcceptedIds([]);
      setRejectedIds([]);

      // Close the modal
      onClose();

      // Refresh the applications
      fetchApplications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update statuses"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !projectData) return null;

  return (
    <div className='fixed inset-0 bg-opacity-40 backdrop-sm bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg'>
        <div className='flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10'>
          <h2 className='text-lg font-medium'>
            Manage Team - {projectData.title}
          </h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              onClose();
              setAcceptedIds([]);
              setRejectedIds([]);
            }}
            className='text-gray-500 hover:text-gray-700 h-8 w-8'>
            <X size={18} />
          </Button>
        </div>

        <div className='p-4'>
          {loading && (
            <div className='text-sm text-gray-600 mb-4 flex items-center justify-center py-6'>
              <div className='animate-spin mr-2 h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent'></div>
              Loading applications...
            </div>
          )}
          {error && (
            <p className='text-sm text-red-600 mb-4 p-2 bg-red-50 rounded'>
              {error}
            </p>
          )}

          {applications.length === 0 && !loading ? (
            <div className='text-sm text-gray-600 text-center py-8 border rounded-lg bg-gray-50'>
              No pending applications found.
            </div>
          ) : (
            <div className='space-y-3 mt-2'>
              {applications.map((application) => (
                <div
                  key={application.id}
                  className='flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 border'>
                      <AvatarFallback className='bg-gray-100 text-gray-800'>
                        {application.applicant.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>
                        {application.applicant.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {application.applicant.email}
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleAccept(application.id)}
                      variant={
                        acceptedIds.includes(application.id)
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      className={`
                        ${
                          acceptedIds.includes(application.id)
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-green-600 text-green-600 hover:bg-green-50"
                        }
                        transition-colors
                      `}>
                      {acceptedIds.includes(application.id) ? (
                        <>
                          <Check size={16} className='mr-1' /> Accepted
                        </>
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(application.id)}
                      variant={
                        rejectedIds.includes(application.id)
                          ? "default"
                          : "outline"
                      }
                      size='sm'
                      className={`
                        ${
                          rejectedIds.includes(application.id)
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "border-red-600 text-red-600 hover:bg-red-50"
                        }
                        transition-colors
                      `}>
                      {rejectedIds.includes(application.id) ? (
                        <>
                          <X size={16} className='mr-1' /> Rejected
                        </>
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end p-4 border-t sticky bottom-0 bg-white gap-2 shadow-md'>
          <Button variant='outline' onClick={onClose} className='text-gray-700'>
            Cancel
          </Button>
          <Button
            onClick={saveChanges}
            disabled={acceptedIds.length === 0 && rejectedIds.length === 0}
            className='bg-black hover:bg-gray-800 text-white disabled:opacity-50'>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
