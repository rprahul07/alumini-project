import React, { useState } from 'react';
import AppliedJobs from './AppliedJobs';
import MyCreatedJobs from './MyCreatedJobs';
import CreateJobModal from './CreateJobModal';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Opportunities = ({ showAlert }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myjobs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreateSelected, setIsCreateSelected] = useState(false);

  // Tab visibility logic
  const canCreate = user?.role === 'alumni' || user?.role === 'admin';

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    // Trigger refresh of MyCreatedJobs component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-row gap-2 mb-4 items-center overflow-visible">
        {canCreate && (
          <>
            {/* Modern Glassy + Button (highest z, animated ring, no shadow/scale) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 group relative overflow-visible hover:bg-white/30 z-30 after:content-[''] after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:transition-all after:duration-300 after:opacity-0 hover:after:opacity-100 hover:after:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] after:z-[-1]"
              onClick={() => {
                setIsCreateSelected(true);
                setShowCreateModal(true);
              }}
              aria-label="Create Opportunity"
              title="Create Opportunity"
              tabIndex={0}
              style={{ minWidth: '2rem', minHeight: '2rem' }}
            >
              <PlusIcon className="h-4 w-4 text-white group-hover:text-primary-300 transition-colors" />
            </motion.button>
            {/* My Opportunities Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                activeTab === 'myjobs'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-lg'
                  : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
              }`}
              onClick={() => {
                setActiveTab('myjobs');
                setIsCreateSelected(false);
              }}
            >
              <span>My Opportunities</span>
            </motion.button>
          </>
        )}
        {/* Applied Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
            activeTab === 'applied'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-lg'
              : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
          }`}
          onClick={() => {
            setActiveTab('applied');
            setIsCreateSelected(false);
          }}
        >
          <span>Applied</span>
        </motion.button>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'myjobs' && canCreate && <MyCreatedJobs showAlert={showAlert} refreshTrigger={refreshTrigger} />}
        {activeTab === 'applied' && <AppliedJobs />}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateJobModal
          onClose={() => {
            setShowCreateModal(false);
            setIsCreateSelected(false);
          }}
          onSuccess={handleCreateSuccess}
          showAlert={showAlert}
        />
      )}
    </div>
  );
};

export default Opportunities; 