import { useState } from 'react';

function FaqButtons({ onSelect }) {
  const categories = ['All', 'Account', 'Opportunities', 'Networking', 'Profile', 'Support', 'Technical'];
  const [active, setActive] = useState('All');

  const handleClick = (cat) => {
    setActive(cat);
    onSelect(cat);
  };

  return (
    <div className="flex justify-center flex-wrap gap-3 mb-5">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            active === cat
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default FaqButtons;