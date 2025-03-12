import React, { useState } from 'react';

const EditProjectModal = ({ isOpen, onClose, projectData, onSave }) => {
  const [title, setTitle] = useState(projectData?.title || '');
  const [description, setDescription] = useState(projectData?.description || '');
  const [tags, setTags] = useState(projectData?.tags || []);
  const [deadline, setDeadline] = useState(projectData?.deadline || '');

  const handleSave = () => {
    onSave({ title, description, tags, deadline });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50">
     
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Edit project details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-6">
            Make changes to your project here. Click save when you're done.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Autonomous Robot Navigation using Deep RL"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded h-24 resize-none"
              placeholder="This project focuses on developing autonomous navigation capabilities for robots using Deep Reinforcement Learning techniques. It adheres to the WAI-ARIA design pattern."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button className="ml-1 text-blue-800">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Computer Science Engineering ×</span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Web Development ×</span>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Robot ×</span>
            </div>
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <div className="relative">
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border rounded pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button 
            onClick={handleSave}
            className="bg-black hover:bg-black text-white px-4 py-2 rounded"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;