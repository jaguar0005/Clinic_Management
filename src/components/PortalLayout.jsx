import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const PortalLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col md:flex-row text-[#1A1A1A]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
