import React from 'react';

const AvailabilityBadge = ({ available }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
        available
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {available ? 'Available' : 'Occupied'}
    </span>
  );
};

export default AvailabilityBadge;
