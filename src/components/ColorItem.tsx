'use client';

import { Color } from '@/data/types';

interface ColorItemProps {
  color: Color;
}

export default function ColorItem({ color }: ColorItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="h-24 w-24 rounded-full border-2 border-gray-200 mb-2"
        style={{ backgroundColor: color.hexCode }}
      />
      <span className="text-sm font-medium text-gray-800">{color.name}</span>
      <span className="text-xs text-gray-500">{color.hexCode}</span>
    </div>
  );
}
