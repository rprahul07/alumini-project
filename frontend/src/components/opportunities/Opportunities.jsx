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
      {/* Mobile-First Tabs */}
      <div className="flex flex-col gap-2 mb-3">
        {/* Mobile Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                activeTab === 'myjobs'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => {
                setActiveTab('myjobs');
                setIsCreateSelected(false);
              }}
            >
              My Opportunities
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeTab === 'applied'
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => {
              setActiveTab('applied');
              setIsCreateSelected(false);
            }}
          >
            Applied
          </motion.button>
        </div>
        
        {/* Mobile Create Button */}
        {canCreate && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
              onClick={() => {
                setIsCreateSelected(true);
                setShowCreateModal(true);
              }}
            >
              <PlusIcon className="h-4 w-4" />
              Create Opportunity
            </motion.button>
          </div>
        )}
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