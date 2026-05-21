import React from 'react';
import { Wifi, Tv, Coffee, Wind, Flame, Sun, Car } from 'lucide-react';

const iconMap = {
  wifi: Wifi,
  tv: Tv,
  coffee: Coffee,
  ac: Wind,
  heating: Flame,
  balcony: Sun,
  parking: Car,
};

const AmenitiesChips = ({ amenities = [] }) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity, index) => {
        const Icon = iconMap[amenity.toLowerCase()] || Coffee; // Fallback icon
        return (
          <div
            key={index}
            className="flex items-center gap-1 px-2.5 py-1 bg-rs-secondary-bg text-rs-secondary-text rounded-full text-xs border border-gray-200"
          >
            <Icon size={12} />
            <span className="capitalize">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AmenitiesChips;
