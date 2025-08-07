import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Simple count-up animation hook
function useCountUp(end, duration = 1200) {
  const [count, setCount] = React.useState(0);
  const startTimestamp = useRef(null);

  useEffect(() => {
    let frame;
    function animate(timestamp) {
      if (!startTimestamp.current) startTimestamp.current = timestamp;
      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);
  return count;
}

const StatCard = ({ title, value, Icon, color = 'blue', progress, progressText }) => {
  const count = useCountUp(Number(value));

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  const progressBarColor = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 mt-1">
            {count.toLocaleString()}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue} shadow-md transition-all duration-300`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-5">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressBarColor[color] || progressBarColor.blue}`}
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{progressText}</p>
        </div>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  Icon: PropTypes.elementType,
  color: PropTypes.string,
  progress: PropTypes.number,
  progressText: PropTypes.string,
};

export default StatCard;