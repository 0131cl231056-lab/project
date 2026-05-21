import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

const OwnerCard = ({ owner }) => {
  if (!owner) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full border-4 border-rs-secondary-bg overflow-hidden shadow-sm mb-4">
        <img
          src={owner.avatar || `https://ui-avatars.com/api/?name=${owner.name || 'Owner'}&background=F5F2E9&color=C27A62`}
          alt={owner.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-xl font-bold text-rs-primary-text mb-1">{owner.name}</h3>
      <p className="text-sm text-rs-secondary-text mb-4">
        Host since {owner.joinDate || '2023'}
      </p>

      {owner.bio && (
        <p className="text-sm text-gray-600 mb-6 italic line-clamp-3">
          "{owner.bio}"
        </p>
      )}

      <div className="w-full flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-2 bg-rs-accent hover:bg-[#a0634f] text-white py-3 rounded-xl font-semibold transition-colors duration-300">
          <MessageSquare size={18} />
          Message Host
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-rs-secondary-bg hover:bg-gray-100 text-rs-primary-text py-3 rounded-xl font-semibold transition-colors duration-300 border border-gray-200">
          <Phone size={18} />
          Contact Details
        </button>
      </div>
    </div>
  );
};

export default OwnerCard;
