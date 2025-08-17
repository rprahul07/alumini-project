
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <div className="max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Alumni Connect. All Rights Reserved.</p>
        <p>Made with ❤️ for our esteemed alumni.</p>
      </div>
    </footer>
  );
};

export default Footer;