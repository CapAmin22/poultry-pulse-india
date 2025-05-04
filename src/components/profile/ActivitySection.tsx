
import React from 'react';

const ActivitySection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-gray-800">Marketplace</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">No recent marketplace activity.</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Financial Applications</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">No recent financial applications.</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Network Activity</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">No recent network activity.</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Training</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-500">No recent training activity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySection;
