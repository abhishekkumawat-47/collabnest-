import Link from "next/link";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Resource } from "@/types/leaderboard"

const LearningMaterialsModal = ({
  id,
  isOpen,
  onClose,
  materials = [],
  onSave,
  isAuthor,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  materials?: Resource[];
  onSave: (updatedResources: Resource[]) => void;
  isAuthor: boolean;
}) => {
  const [resourcesList, setResourcesList] = useState<Resource[]>([]);
  const [temp, setTemp] = useState<Resource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceLink, setNewResourceLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resourceType, setResourceType] = useState<"link" | "doc">("link");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize resourcesList and temp when materials or id changes
  useEffect(() => {
    if (materials && materials.length > 0) {
      const resourcesWithIds = materials.map((resource) => ({
        ...resource,
        id: resource.id || uuidv4(), // Ensure each resource has an ID
      }));
      setResourcesList(resourcesWithIds);
      setTemp(resourcesWithIds); // Initialize temp with the same data
    } else {
      setResourcesList([]);
      setTemp([]);
    }
  }, [materials, id]);

  // Remove a resource from the temp list
  const handleRemoveResource = (id: string) => {
    setTemp(temp.filter((resource) => resource.id !== id));
  };

  // Save changes and call the update API
  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (temp.length === 0) {
        // If there are no resources, send an empty array
        const response = await fetch("/api/forDashboard/updateResources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resources: [],
            projectId: id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update resources");
        }

        setResourcesList([]);
        onSave([]);
        onClose();
        return;
      }

      // Process each resource - upload files first if needed
      const processedResources = await Promise.all(
        temp.map(async (resource) => {
          // If it's a document type with a file that needs uploading
          if (resource.type === "doc" && resource.file) {
            const formData = new FormData();
            formData.append("file", resource.file);

            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Failed to upload file: ${resource.name}`);
            }

            const data = await response.json();

            // Return the resource with the uploaded file URL but without the file object
            return {
              id: resource.id,
              name: resource.name,
              url: data.url,
              type: resource.type,
            };
          }

          // If it's a link or already uploaded doc, return only the needed properties
          return {
            id: resource.id,
            name: resource.name,
            url: resource.url,
            type: resource.type,
          };
        })
      );

      // Call the update API with the processed resources
      const response = await fetch("/api/forDashboard/updateResources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resources: processedResources,
          projectId: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update resources: ${
            errorData.error || response.statusText
          }`
        );
      }

      // Update the resourcesList with the processed resources
      const updatedResources = processedResources.map((resource) => ({
        ...resource,
        file: null, // Ensure no file objects in state
      }));

      setResourcesList(updatedResources);
      onSave(updatedResources); // Pass updated resources back to parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving resources:", error);
      // Revert to the original resourcesList if the save fails
      setTemp(resourcesList);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new resource to the temp list
  const handleAddResource = () => {
    if (!newResourceTitle) return;

    const newResource: Resource = {
      id: uuidv4(), // Generate a unique ID
      name: newResourceTitle,
      url: resourceType === "link" ? newResourceLink : "", // URL for links, empty for files
      file: resourceType === "doc" ? selectedFile : null, // File for docs, null for links
      type: resourceType,
    };

    // Add the new resource to the temp list
    setTemp([...temp, newResource]);
    // Reset input fields
    setNewResourceTitle("");
    setNewResourceLink("");
    setSelectedFile(null);
  };

  // Reset temp to the original resourcesList and close the modal
  const handleClose = () => {
    setTemp(resourcesList); // Reset temp to the original state
    setNewResourceLink("");
    setNewResourceTitle("");
    setSelectedFile(null);
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-medium'>Learning Materials</h2>
          <Button
            onClick={handleClose}
            className='text-white'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </Button>
        </div>

        <div className='p-4'>
          {!isAuthor && (
            <p className='text-sm text-gray-600 mb-4'>
              These are the learning materials uploaded by the author.
            </p>
          )}

          {isAuthor && (
            <div className='mb-6'>
              <h3 className='font-medium mb-3'>Add New Resource</h3>
              <div className='flex mb-3'>
                <Button
                  onClick={() => setResourceType("link")}
                  className={`px-4 py-2 mr-2 ${
                    resourceType === "link"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } rounded`}>
                  Link
                </Button>
                <Button
                  onClick={() => setResourceType("doc")}
                  className={`px-4 py-2 ${
                    resourceType === "doc"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  } rounded`}>
                  File
                </Button>
              </div>
              <Input
                type='text'
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                placeholder='Enter Title'
                className='w-full p-2 border rounded mb-2'
              />
              {resourceType === "link" ? (
                <input
                  type='text'
                  value={newResourceLink}
                  onChange={(e) => setNewResourceLink(e.target.value)}
                  placeholder='Enter URL'
                  className='w-full p-2 border rounded mb-2'
                />
              ) : (
                <Input
                  type='file'
                  accept='application/pdf'
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className='w-full p-2 border rounded mb-2'
                />
              )}
              <Button
                onClick={handleAddResource}
                disabled={
                  !newResourceTitle ||
                  (resourceType === "link" && !newResourceLink) ||
                  (resourceType === "doc" && !selectedFile)
                }
                className='bg-blue-600 text-white px-3 py-2 rounded mt-2 w-full'>
                Add Resource
              </Button>
            </div>
          )}

          <div className='mt-6'>
            <h3 className='font-medium mb-3'>Resources ({temp.length})</h3>
            {temp.length === 0 ? (
              <p className='text-gray-500 text-sm'>No resources added yet.</p>
            ) : (
              temp.map((resource) => (
                <div
                  key={resource.id}
                  className='mb-2 flex justify-between items-center p-3 border rounded'>
                  <div className='flex-1'>
                    <div className='font-medium'>{resource.name}</div>
                    {resource.url && (
                      <Link
                        href={resource.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-blue-500 truncate'>
                        {resource.type === "doc" ? "View PDF" : resource.url}
                      </Link>
                    )}
                    {resource.file && (
                      <span className='text-sm text-gray-500'>
                        File selected: {resource.file.name}
                      </span>
                    )}
                  </div>
                  {isAuthor && (
                    <Button
                      onClick={() => handleRemoveResource(resource.id)}
                      className='text-red-500 ml-2'
                      title='Remove resource'>
                      &#10005;
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {isAuthor && (
          <div className='flex justify-end p-4 border-t'>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className='bg-black text-white px-4 py-2 rounded'>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningMaterialsModal;
