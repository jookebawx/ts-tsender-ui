// components/InputField.tsx

import React from "react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  value,
  type = "text",
  large = false,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {large ? (
        <textarea
          className="border border-gray-300 rounded-md p-2 text-sm resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default InputField;
