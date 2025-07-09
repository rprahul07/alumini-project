import React, { useState } from 'react';
import FaqHeading from '../../components/FaqHeading';
import FaqButtons from '../../components/FaqButtons';
import FaqList from '../../components/FaqList';

function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

return (
  <div className="max-w-[800px] mx-auto my-10 p-6 bg-white rounded-lg shadow-md font-sans">
    <FaqHeading />
    <FaqButtons onSelect={setSelectedCategory} />
    <FaqList selectedCategory={selectedCategory} />
  </div>
);
}

export default FaqPage;