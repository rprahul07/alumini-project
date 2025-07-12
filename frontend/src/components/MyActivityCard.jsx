import React, { useState } from 'react';

const MyActivityCard = ({ features, defaultTab }) => {
  const [mainTab, setMainTab] = useState(defaultTab || features[0]?.key);

  const currentFeature = features.find(f => f.key === mainTab);

  return (
    <section className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col min-h-[320px] md:min-h-[420px] max-h-[480px] overflow-y-auto scrollbar-hide">
      {/* Parent tab bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Activity</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {features.map(feature => (
            <button
              key={feature.key}
              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${mainTab === feature.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => setMainTab(feature.key)}
            >
              {feature.label}
            </button>
          ))}
        </div>
      </div>
      {/* Render selected feature */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {currentFeature?.component}
      </div>
    </section>
  );
};

export default MyActivityCard; 