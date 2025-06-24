import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateEventModal from './CreateEventModal';

const CreateEventButton = ({ onEventCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        <span className="hidden xs:inline">Create Event</span>
      </button>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={onEventCreated}
        isMobileModal={true}
      />
    </>
  );
};

export default CreateEventButton; 