import React, { useState } from 'react';

const EditLearningMaterialsModal = ({ isOpen, onClose, materials, onSave }) => {
  const [title, setTitle] = useState(materials?.title || '');
  const [link, setLink] = useState(materials?.link || '');
  const [resourcesList, setResourcesList] = useState(materials?.resources || []);

  const handleRemoveResource = (index) => {
    const newResources = [...resourcesList];
    newResources.splice(index, 1);
    setResourcesList(newResources);
  };

  const handleSave = () => {
    onSave({ title, link, resources: resourcesList });
    onClose();
  };

  const handleAddResource = () => {
    if (title && link) {
      setResourcesList([...resourcesList, { title, link }]);
      setTitle('');
      setLink('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50">
    
      <div className="bg-white rounded-lg w-full max-w-lg max-h-90vh overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Edit Learning Materials</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-6">
            Add or make changes to your resources here. Click save when you're done.
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
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
            <div className="flex border rounded overflow-hidden">
              <div className="bg-gray-100 p-2 flex items-center text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <input 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://deeprl.com/paper.pdf"
                className="flex-1 p-2 outline-none"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <button className="border border-dashed border-gray-300 p-3 w-full flex flex-col items-center text-gray-500 rounded hover:bg-gray-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span className="mt-1">Upload File</span>
            </button>
          </div>
          
          {/* Resource list */}
          {resourcesList.map((resource, index) => (
            <div key={index} className="mb-2 flex justify-between items-center p-3 border rounded">
              <div className="flex items-center">
                <svg className="mr-2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
                <div>
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-gray-500">{resource.link}</div>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveResource(index)}
                className="text-red-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
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

export default EditLearningMaterialsModal;