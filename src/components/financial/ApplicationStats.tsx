
import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';

interface ApplicationStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    reviewing?: number;
  };
  previousStats?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    reviewing?: number;
  };
  onFilterByStatus?: (status: string) => void;
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({ 
  stats, 
  previousStats,
  onFilterByStatus
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { isAdmin: roleIsAdmin } = useRole();

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return null;
    return previous === 0 ? 100 : ((current - previous) / previous) * 100;
  };

  // Generate stats cards with change indicators if previous stats are provided
  const renderStatCard = (label: string, value: number, color: string, status?: string) => {
    let change = null;
    let changeColor = 'text-gray-500';
    
    if (previousStats && status) {
      const prevValue = previousStats[status as keyof typeof previousStats] as number || 0;
      change = calculateChange(value, prevValue);
      
      if (change !== null) {
        // For most stats, up is good (except rejected)
        const isPositiveGood = status !== 'rejected';
        const isPositive = change > 0;
        
        changeColor = isPositiveGood === isPositive ? 'text-green-500' : 'text-red-500';
      }
    }
    
    const handleCardClick = () => {
      if (status && onFilterByStatus) {
        onFilterByStatus(status);
      } else if (isAdmin || roleIsAdmin) {
        navigate('/admin');
      }
    };
    
    return (
      <div 
        className={`bg-white p-4 rounded-md shadow hover:shadow-md transition-shadow ${
          status || (isAdmin || roleIsAdmin) ? 'cursor-pointer' : ''
        } ${
          status ? 'hover:bg-gray-50' : ''
        }`}
        onClick={handleCardClick}
        title={status ? `Filter by ${label.toLowerCase()} applications` : ''}
      >
        <p className="text-gray-500 text-xs">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        
        {change !== null && (
          <div className={`flex items-center text-xs mt-1 ${changeColor}`}>
            {change > 0 ? (
              <>
                <ArrowUp className="h-3 w-3 mr-1" />
                {change.toFixed(1)}%
              </>
            ) : change < 0 ? (
              <>
                <ArrowDown className="h-3 w-3 mr-1" />
                {Math.abs(change).toFixed(1)}%
              </>
            ) : (
              'No change'
            )}
            <span className="ml-1 text-gray-400">vs. previous period</span>
          </div>
        )}
        
        {(isAdmin || roleIsAdmin) && !status && (
          <div className="flex items-center text-xs mt-2 text-blue-500">
            <span>View in admin dashboard</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {renderStatCard('Total Applications', stats.total, 'text-gray-800')}
      {renderStatCard('Pending Review', stats.pending || 0, 'text-yellow-500', 'pending')}
      {renderStatCard('Under Review', stats.reviewing || 0, 'text-blue-500', 'reviewing')}
      {renderStatCard('Approved', stats.approved || 0, 'text-green-500', 'approved')}
      {renderStatCard('Rejected', stats.rejected || 0, 'text-red-500', 'rejected')}
    </div>
  );
};

export default ApplicationStats;
