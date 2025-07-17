import React, { useState } from 'react';

const MyActivityCard = ({ features, defaultTab }) => {
  const [mainTab, setMainTab] = useState(defaultTab || features[0]?.key);

  const currentFeature = features.find(f => f.key === mainTab);

  return (
    <section className="flex flex-col h-full min-h-[320px]">
      {/* Header: fixed */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 flex-shrink-0">
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
      {/* Content: scrollable */}
      <div className="flex-1 overflow-visible scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {currentFeature?.component}
      </div>
    </section>
  );
};

export default MyActivityCard; 