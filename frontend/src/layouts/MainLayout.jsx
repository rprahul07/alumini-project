// ✅ Cleaned & Optimized - Placeholder-safe
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default MainLayout; 