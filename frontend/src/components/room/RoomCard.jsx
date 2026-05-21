import React from 'react';
import { MapPin, User, ChevronRight } from 'lucide-react';
import AvailabilityBadge from './AvailabilityBadge';
import AmenitiesChips from './AmenitiesChips';
import { Link } from 'react-router'; // Fixed router import based on app.routes.jsx

const RoomCard = ({ room }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
         src={room.roomImages?.[0]}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <AvailabilityBadge available={room.available} />
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="font-bold text-rs-primary-text">INR {room.rent}</span>
          <span className="text-xs text-rs-secondary-text">/mo</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-rs-primary-text line-clamp-1">{room.title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-rs-secondary-text mb-4 gap-1">
          <MapPin size={14} className="text-rs-accent" />
          <span className="truncate">{room.city}, {room.state}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{room.roomType || 'Private Room'}</span>
        </div>

        {/* Compatibility Badge */}
        {room.compatibility && (
          <div className="mb-3">
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              {room.compatibility}% Match
            </div>
          </div>
        )}

        <div className="mb-1">
          <AmenitiesChips amenities={room.amenities?.slice(0, 2)} />
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rs-secondary-bg overflow-hidden border border-gray-200">
              <img 
                src={room.owner?.profilePicture || `https://ui-avatars.com/api/?name=${room.owner?.fullname || 'O'}&background=F5F2E9&color=C27A62`} 
                alt={room.owner?.fullname || 'Owner'} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-rs-primary-text truncate max-w-[100px]">
              {room.owner?.fullname || 'Owner'}
            </span>
          </div>
          <Link
            to={`/room/${room._id}`}
            className="flex items-center gap-1 text-sm font-semibold text-rs-accent hover:text-[#a0634f] transition-colors"
          >
            View Details <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
