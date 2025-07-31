// ✅ Cleaned & Optimized - Placeholder-safe
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-8 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 