
import React from 'react';

interface ApplicationStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    reviewing?: number;
  };
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-md shadow">
        <p className="text-gray-500 text-xs">Total Applications</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <p className="text-gray-500 text-xs">Pending Review</p>
        <p className="text-2xl font-bold text-yellow-500">{stats.pending || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <p className="text-gray-500 text-xs">Approved</p>
        <p className="text-2xl font-bold text-green-500">{stats.approved || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-md shadow">
        <p className="text-gray-500 text-xs">Rejected</p>
        <p className="text-2xl font-bold text-red-500">{stats.rejected || 0}</p>
      </div>
    </div>
  );
};

export default ApplicationStats;
