import React, { useState } from 'react';
import Modal from '@/components/modals/EndModal';
import EndButton from '@/components/ui/end-button';

interface EndProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEndProject: (ratings: { [userId: string]: number }) => void;
  contributors: { id: string; name: string }[];
}

const EndProjectModal: React.FC<EndProjectModalProps> = ({ isOpen, onClose, onEndProject, contributors }) => {
  const [ratings, setRatings] = useState<{ [userId: string]: number }>({});

  const handleRatingChange = (userId: string, value: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [userId]: value,
    }));
  };

  const handleEndProject = () => {
    onEndProject(ratings);
    onClose(); // Close the modal after ending the project
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="End Project">
      <div>
        <p>Are you sure you want to end this project?</p>
        <p>Please rate all contributors out of 10:</p>
        {contributors.map((contributor, index) => (
          <div key={`${contributor.id}-${index}`} className="mb-4 mt-5 font-semibold">
            <label>{contributor.name}</label>
            <input
              type="number"
              min="0"
              max="10"
              value={ratings[contributor.id] || 0}
              onChange={(e) => handleRatingChange(contributor.id, parseInt(e.target.value))}
              className="ml-2 p-1 border rounded"
            />
          </div>
        ))}
        <EndButton onClick={handleEndProject} className="mt-4 bg-red-600 hover:bg-red-700 transition-colors duration-100 ease-in text-white">
          End Project
        </EndButton>
      </div>
    </Modal>
  );
};

export default EndProjectModal;