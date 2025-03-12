import React, { useState } from 'react';

const EditTaskTimelineModal = ({ isOpen, onClose, tasks, onSave }) => {
  const [taskList, setTaskList] = useState(tasks || []);

  const handleAddTask = () => {
    setTaskList([...taskList, { 
      id: Date.now(),
      title: '', 
      description: '', 
      deadline: '' 
    }]);
  };

  const handleTaskChange = (id, field, value) => {
    setTaskList(taskList.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleRemoveTask = (id) => {
    setTaskList(taskList.filter(task => task.id !== id));
  };

  const handleSave = () => {
    onSave(taskList);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-brightness-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-lg">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Task Timeline</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✖
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-600 mb-6">
            Add or make changes to your tasks. Click save when you're done.
          </p>
          
          {taskList.map((task, index) => (
            <div key={task.id} className="mb-6 border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Task {index + 1}</span>
                <button 
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑 Remove
                </button>
              </div>
              
              {/* Task Title */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={task.title} 
                  onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Task Title"
                />
              </div>
              
              {/* Task Description */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={task.description} 
                  onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                  className="w-full p-2 border rounded h-20 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Task Description"
                />
              </div>
              
              {/* Task Deadline */}
              <div className="mb-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input 
                  type="date" 
                  value={task.deadline} 
                  onChange={(e) => handleTaskChange(task.id, 'deadline', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
          ))}
          
          {/* Add Task Button */}
          <button 
            onClick={handleAddTask}
            className="text-blue-600 hover:text-blue-800 flex items-center mt-2"
          >
            ➕ Add Task
          </button>
        </div>
        
        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t">
          <button 
            onClick={handleSave}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditTaskTimelineModal;