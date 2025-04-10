
import React from 'react';
import { StepProps } from '../OnboardingTypes';
import { STAKEHOLDER_ROLES } from '../OnboardingConstants';
import { LandPlot, Briefcase, Users, Leaf, BarChart2, GraduationCap, Building, Beaker } from 'lucide-react';

const RoleSelectionStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  // Function to render the correct icon based on the icon name from constants
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-16 w-16 mb-3 text-[#ea384c]" };
    switch(iconName) {
      case 'LandPlot': return <LandPlot {...iconProps} />;
      case 'Briefcase': return <Briefcase {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'Leaf': return <Leaf {...iconProps} />;
      case 'BarChart2': return <BarChart2 {...iconProps} />;
      case 'GraduationCap': return <GraduationCap {...iconProps} />;
      case 'Building': return <Building {...iconProps} />;
      case 'Beaker': return <Beaker {...iconProps} />;
      default: return <Users {...iconProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Select the option that best describes your role in the poultry industry:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAKEHOLDER_ROLES.map(role => (
          <div
            key={role.id}
            className={`p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg text-center ${
              onboardingData.role === role.id
                ? 'border-[#ea384c] bg-red-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-red-200'
            }`}
            onClick={() => handleChange('role', role.id)}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              {renderIcon(role.icon)}
              <h3 className="font-semibold text-lg text-gray-900">{role.name}</h3>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionStep;
