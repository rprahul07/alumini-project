import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateEventModal from './CreateEventModal';

const CreateEventButton = ({ onEventCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold border border-primary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
      >
        <PlusIcon className="h-4 w-4" />
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