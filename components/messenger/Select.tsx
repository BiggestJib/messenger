"use client";
import React from "react";
import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  options: Record<string, any>[];
  onChange: (value: Record<string, any>) => void;
  value: Record<string, any>;
  disabled?: boolean; // Marked as optional for flexibility
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  disabled = false, // Default value for disabled
  options,
}) => {
  return (
    <div className="z-[100]">
      <label
        htmlFor={label}
        className="block text-sm font-medium leading-6 text-gray-700"
      >
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body} // Attach menu to the body to avoid overflow issues
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Fixed style block
          }}
          classNamePrefix="react-select" // Added classNamePrefix to apply styles more easily
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default Select;
