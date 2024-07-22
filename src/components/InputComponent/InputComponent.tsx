// src/components/StyledInput.tsx
import React from "react";
import { Input } from "@/components/ShadcnComponents/ui/input";

interface StyledInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export const InputComponent: React.FC<StyledInputProps> = ({
  placeholder = "Enter text...",
  value,
  onChange,
  type = "text",
}) => {
  return (
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="left-0 bg-white py-2 px-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
    />
  );
};
