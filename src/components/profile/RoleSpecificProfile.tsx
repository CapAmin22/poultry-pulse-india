
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Home, Building, ShoppingBag, CreditCard, BookOpen, Users, HelpCircle } from 'lucide-react';

interface RoleSpecificProfileProps {
  role: string;
  profileData: any;
}

const RoleSpecificProfile: React.FC<RoleSpecificProfileProps> = ({ role, profileData }) => {
  const renderRoleIcon = () => {
    switch (role) {
      case 'farmer':
        return <Home className="h-6 w-6 text-green-500" />;
      case 'distributor':
      case 'retailer':
        return <ShoppingBag className="h-6 w-6 text-blue-500" />;
      case 'processor':
        return <Building className="h-6 w-6 text-purple-500" />;
      case 'supplier':
        return <ShoppingBag className="h-6 w-6 text-orange-500" />;
      case 'financial':
        return <CreditCard className="h-6 w-6 text-red-500" />;
      case 'trainer':
        return <BookOpen className="h-6 w-6 text-cyan-500" />;
      case 'organization':
        return <Users className="h-6 w-6 text-indigo-500" />;
      default:
        return <Briefcase className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderRoleSpecificFields = () => {
    switch (role) {
      case 'farmer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Farm Size</h3>
              <p className="mt-1">{profileData.farming_capacity || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Farming System</h3>
              <p className="mt-1">{profileData.farming_system || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Poultry Types</h3>
              <p className="mt-1">{profileData.poultry_types?.join(', ') || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Years in Business</h3>
              <p className="mt-1">{profileData.years_in_business || 'Not specified'}</p>
            </div>
          </div>
        );
      
      case 'distributor':
      case 'retailer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Distribution Area</h3>
              <p className="mt-1">{profileData.location || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Business Size</h3>
              <p className="mt-1">{profileData.business_size || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Years in Business</h3>
              <p className="mt-1">{profileData.years_in_business || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Product Types</h3>
              <p className="mt-1">{profileData.product_types?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Organization</h3>
              <p className="mt-1">{profileData.organization || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Services Offered</h3>
              <p className="mt-1">{profileData.services_offered?.join(', ') || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Experience</h3>
              <p className="mt-1">{profileData.experience_level || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Areas of Expertise</h3>
              <p className="mt-1">{profileData.financial_services?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
        );

      case 'trainer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Specializations</h3>
              <p className="mt-1">{profileData.training_specializations?.join(', ') || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
              <p className="mt-1">{profileData.experience_level || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Certifications</h3>
              <p className="mt-1">{profileData.certifications?.join(', ') || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Organization</h3>
              <p className="mt-1">{profileData.organization || 'Not specified'}</p>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Organization Type</h3>
              <p className="mt-1">{profileData.organization_type || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Scope</h3>
              <p className="mt-1">{profileData.organization_scope || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Website</h3>
              <p className="mt-1">
                {profileData.website_url ? (
                  <a 
                    href={profileData.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    {profileData.website_url}
                  </a>
                ) : (
                  'Not specified'
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Services Offered</h3>
              <p className="mt-1">{profileData.services_offered?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Complete your profile to see role-specific information here.
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader className="flex flex-row items-center gap-2">
        {renderRoleIcon()}
        <div>
          <CardTitle>Role-Specific Information</CardTitle>
          <p className="text-sm text-gray-500 capitalize">
            {role === 'organization' ? 'Organization' : 
             role === 'financial' ? 'Financial Service Provider' :
             role + ' Profile'}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {renderRoleSpecificFields()}
      </CardContent>
    </Card>
  );
};

export default RoleSpecificProfile;
