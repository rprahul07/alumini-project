import React, { useState } from 'react';
import AppliedJobs from './AppliedJobs';
import MyCreatedJobs from './MyCreatedJobs';
import CreateJobModal from './CreateJobModal';
import { useAuth } from '../../contexts/AuthContext';

const Opportunities = ({ showAlert }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myjobs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreateSelected, setIsCreateSelected] = useState(false);

  // Tab visibility logic
  const canCreate = user?.role === 'alumni' || user?.role === 'admin';

  const handleCreateSuccess = () => {
    // Refresh the jobs list if needed
    // The modal will handle the success message
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-row gap-2 mb-4">
        {canCreate && (
          <>
            <button
              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                isCreateSelected 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-white text-green-600 border-green-600 hover:bg-green-50'
              }`}
              onClick={() => {
                setIsCreateSelected(true);
                setShowCreateModal(true);
              }}
            >
              Create
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${activeTab === 'myjobs' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => {
                setActiveTab('myjobs');
                setIsCreateSelected(false);
              }}
            >
              My opportunities
            </button>
          </>
        )}
        <button
          className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${activeTab === 'applied' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => {
            setActiveTab('applied');
            setIsCreateSelected(false);
          }}
        >
          Applied 
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'myjobs' && canCreate && <MyCreatedJobs />}
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