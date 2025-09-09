import React, { useState } from 'react';
import MyEvents from './MyEvents';
import RegisteredEvents from './RegisteredEvents';
import CreateEventModal from '../CreateEventModal';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Events = ({ showAlert }) => {
  const { user } = useAuth();
  
  // Tab visibility logic
  const canCreate = user?.role === 'alumni' || user?.role === 'faculty' || user?.role === 'admin';
  
  // Set default tab based on user role - students should see registered events by default
  const [activeTab, setActiveTab] = useState(canCreate ? 'myevents' : 'registered');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreateSelected, setIsCreateSelected] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    // Trigger refresh of MyEvents component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile-First Tabs */}
      <div className="flex flex-col gap-2 mb-3">
        {/* Mobile Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                activeTab === 'myevents'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500'
                  : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
              onClick={() => {
                setActiveTab('myevents');
                setIsCreateSelected(false);
              }}
            >
              My Events
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              activeTab === 'registered'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
            onClick={() => {
              setActiveTab('registered');
              setIsCreateSelected(false);
            }}
          >
            Registered
          </motion.button>
        </div>
        
        {/* Mobile Create Button */}
        {canCreate && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold border border-primary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
              onClick={() => {
                setIsCreateSelected(true);
                setShowCreateModal(true);
              }}
            >
              <PlusIcon className="h-4 w-4" />
              Create Event
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Tab Content - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'myevents' && canCreate && <MyEvents showAlert={showAlert} refreshTrigger={refreshTrigger} />}
        {activeTab === 'registered' && <RegisteredEvents />}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setIsCreateSelected(false);
          }}
          onEventCreated={handleCreateSuccess}
          isMobileModal={true}
        />
      )}
    </div>
  );
};

export default Events; 