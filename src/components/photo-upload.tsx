'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, User } from 'lucide-react';

interface PhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  if (value) {
    return (
      <div className="relative group w-32 h-32 mx-auto">
        <img
          src={value}
          alt="照片预览"
          className="w-32 h-32 rounded-full object-cover border-3 border-[#c9a96e] shadow-lg"
        />
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-[#c9a96e] bg-[#c9a96e]/10 scale-105'
          : 'border-gray-300 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {isDragging ? (
        <Upload className="w-8 h-8 text-[#c9a96e] mb-1" />
      ) : (
        <User className="w-8 h-8 text-gray-400 mb-1" />
      )}
      <span className="text-xs text-gray-500">上传照片</span>
    </div>
  );
}
