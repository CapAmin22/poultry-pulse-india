
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuthFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

const AuthFormField: React.FC<AuthFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  minLength,
  icon,
  rightElement,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={icon ? "pl-10" : ""}
          required={required}
          minLength={minLength}
        />
        {icon && (
          <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">
            {icon}
          </div>
        )}
        {rightElement && (
          <div className="absolute right-0 top-0 h-10">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFormField;
