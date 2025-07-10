import React, { useState } from 'react';
import CreateJobModal from './CreateJobModal';
import AppliedJobs from './AppliedJobs';
import ReceivedApplications from './ReceivedApplications';
import { useAuth } from '../../contexts/AuthContext';

const Opportunities = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    user?.role === 'alumni' || user?.role === 'admin' ? 'create' : 'applied'
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Tab visibility logic
  const canCreate = user?.role === 'alumni' || user?.role === 'admin';
  const canSeeReceived = user?.role === 'alumni' || user?.role === 'admin';

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex flex-row gap-2 mb-4">
        {canCreate && (
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${activeTab === 'create' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
            onClick={() => setActiveTab('create')}
          >
            Create
          </button>
        )}
        <button
          className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${activeTab === 'applied' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setActiveTab('applied')}
        >
          Applied
        </button>
        {canSeeReceived && (
          <button
            className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${activeTab === 'received' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
            onClick={() => setActiveTab('received')}
          >
            Received
          </button>
        )}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'create' && canCreate && (
          <div className="flex flex-col items-center justify-center h-full">
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold shadow hover:bg-green-700 transition mb-4"
              onClick={() => setShowCreateModal(true)}
            >
              + Create New Opportunity
            </button>
            <p className="text-gray-500">Post a new job or internship opportunity for the community.</p>
            {showCreateModal && <CreateJobModal onClose={() => setShowCreateModal(false)} />}
          </div>
        )}
        {activeTab === 'applied' && <AppliedJobs />}
        {activeTab === 'received' && canSeeReceived && <ReceivedApplications />}
      </div>
    </div>
  );
};

export default Opportunities; 