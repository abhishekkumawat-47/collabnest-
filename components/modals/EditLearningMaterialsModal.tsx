import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid
interface Resource {
  id?: string;
  name: string;
  url: string;
  type: "doc" | "link";
}

const EditLearningMaterialsModal = ({
  id,
  isOpen,
  onClose,
  materials = [],
  onSave,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  materials?: JSON[];
  onSave: () => void;
}) => {
  // Initialize resources with IDs if they don't have them
  const [resourcesList, setResourcesList] = useState([]);

  // Temporary state for changes before saving
  const [temp, setTemp] = useState([]);

  // State for new resource inputs
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceLink, setNewResourceLink] = useState("");

  // Reset states when materials or id changes
  useEffect(() => {
    const resourcesWithIds = materials.map((resource) => ({
      ...resource,
      id: resource.id || uuidv4(),
    }));

    setResourcesList(resourcesWithIds);
    setTemp(resourcesWithIds);
  }, [materials, id]);

  // Generate a unique ID for new resources

  const handleRemoveResource = (id: string) => {
    setTemp(temp.filter((resource) => resource.id !== id));
  };

  const handleSave = async () => {
    // Optimistic UI update

    try {
      const response = await fetch("/api/forDashboard/updateResources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resources: temp,
          projectId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update resources");
        setTemp(resourcesList);
      }
      onClose();
      setResourcesList(temp);
      onSave();
    } catch (error) {
      console.error("Error saving resources:", error);
      setTemp(resourcesList);
    }
  };

  const handleAddResource = () => {
    if (newResourceTitle && newResourceLink) {
      const newResource: Resource = {
        id: uuidv4(),
        name: newResourceTitle,
        url: newResourceLink,
        type: "link",
      };

      setTemp([...temp, newResource]);
      setNewResourceTitle("");
      setNewResourceLink("");
    }
  };

  // Reset temp state when modal closes
  const handleClose = () => {
    setTemp([...resourcesList]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-medium'>Edit Learning Materials</h2>
          <button
            onClick={handleClose}
            className='text-gray-500 hover:text-gray-700'>
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
          </button>
        </div>

        <div className='p-4'>
          <p className='text-sm text-gray-600 mb-6'>
            Add or remove learning resources here. Click save when you're done.
          </p>

          <div className='mb-6'>
            <h3 className='font-medium mb-3'>Add New Resource</h3>

            <div className='mb-3'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Resource Title
              </label>
              <input
                type='text'
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                className='w-full p-2 border rounded'
                placeholder='Enter Title'
              />
            </div>

            <div className='mb-3'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Resource Link
              </label>
              <div className='flex border rounded overflow-hidden'>
                <div className='bg-gray-100 p-2 flex items-center text-gray-500'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'>
                    <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'></path>
                    <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'></path>
                  </svg>
                </div>
                <input
                  type='text'
                  value={newResourceLink}
                  onChange={(e) => setNewResourceLink(e.target.value)}
                  placeholder='Enter URL'
                  className='flex-1 p-2 outline-none'
                />
              </div>
            </div>

            <button
              onClick={handleAddResource}
              className='bg-blue-600 text-white px-3 py-2 rounded mt-2 w-full disabled:bg-blue-300'
              disabled={!newResourceTitle || !newResourceLink}>
              Add Resource
            </button>
          </div>

          {/* Resource list */}
          {temp.length > 0 && (
            <div className='mt-6'>
              <h3 className='font-medium mb-3'>
                Current Resources ({temp.length})
              </h3>
              {temp.map((resource) => (
                <div
                  key={resource.id}
                  className='mb-2 flex justify-between items-center p-3 border rounded'>
                  <div className='flex items-center flex-1 overflow-hidden'>
                    <svg
                      className='mr-2 text-gray-400 flex-shrink-0'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'>
                      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'></path>
                      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'></path>
                    </svg>
                    <div className='overflow-hidden'>
                      <div className='font-medium truncate'>
                        {resource.name}
                      </div>
                      <div className='text-sm text-gray-500 truncate'>
                        {resource.url}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveResource(resource.id)}
                    className='text-red-500 ml-2'
                    title='Remove resource'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'>
                      <polyline points='3 6 5 6 21 6'></polyline>
                      <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end p-4 border-t'>
          <button
            onClick={handleSave}
            className='bg-black hover:bg-black text-white px-4 py-2 rounded'>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLearningMaterialsModal;
