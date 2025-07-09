import { useState } from 'react';

function FaqButtons({ onSelect }) {
  const categories = ['All', 'Account', 'Billing', 'Technical', 'Support'];
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
              ? 'bg-[#5A32EA] text-white'
              : 'bg-[#eaeaea] hover:bg-[#E0E0E0]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default FaqButtons;