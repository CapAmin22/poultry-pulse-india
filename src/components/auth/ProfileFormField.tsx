
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ProfileFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  className?: string;
  description?: string;
}

const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  type = 'text',
  className = '',
  description,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={disabled ? 'bg-gray-50' : ''}
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export default ProfileFormField;
