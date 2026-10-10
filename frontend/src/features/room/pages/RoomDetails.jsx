import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, Calendar, Check, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react';
import AmenitiesChips from '../../../components/room/AmenitiesChips';
import AvailabilityBadge from '../../../components/room/AvailabilityBadge';
import OwnerCard from '../../../components/room/OwnerCard';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRoom } from '../hook/useRoom';

const RoomDetails = () => {
  const { roomId } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const { handleGetRoom } = useRoom()

  const room = useSelector(state => state.room.room)
  const loading = useSelector(state => state.room.loading)

  useEffect(() => {
    handleGetRoom(roomId)
  }, [roomId])

  if (loading || !room) {
    return <div>Loading...</div>
  }


  const nextImage = () =>
    setActiveImage(
      (prev) => (prev + 1) % room.roomImages.length
    );

  const prevImage = () =>
    setActiveImage(
      (prev) =>
        (prev - 1 + room.roomImages.length) %
        room.roomImages.length
    );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/rooms" className="flex items-center gap-2 text-rs-secondary-text hover:text-rs-primary-text transition-colors">
          <ChevronLeft size={20} /> Back to listing
        </Link>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-rs-secondary-text hover:text-rs-primary-text transition-colors">
            <Share2 size={18} /> Share
          </button>
          <button className="flex items-center gap-2 text-rs-secondary-text hover:text-red-500 transition-colors">
            <Heart size={18} /> Save
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 group bg-gray-100">
        <img 
          src={room.roomImages[activeImage]} 
          alt="Room" 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Gallery Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={prevImage} className="bg-white/80 hover:bg-white backdrop-blur-sm p-3 rounded-full text-rs-primary-text shadow-lg transition-transform transform hover:scale-110">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextImage} className="bg-white/80 hover:bg-white backdrop-blur-sm p-3 rounded-full text-rs-primary-text shadow-lg transition-transform transform hover:scale-110">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Gallery Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {room.roomImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`w-2 h-2 rounded-full transition-all {activeImage === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-rs-primary-text tracking-tight">
                {room.title}
              </h1>
              <div className="text-right">
                <p className="text-3xl font-black text-rs-primary-text">INR {room.rent}<span className="text-lg font-normal text-rs-secondary-text">/mo</span></p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-rs-secondary-text">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-rs-accent"/> {room.address}, {room.city}, {room.state}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-rs-accent"/> Posted {room.postedDate}</span>
              <AvailabilityBadge available={room.available} />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-rs-primary-text mb-4">About this space</h2>
            <p className="text-rs-secondary-text leading-relaxed text-lg">{room.description}</p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-rs-primary-text mb-6">Amenities</h2>
            <AmenitiesChips amenities={room.amenities} />
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-2xl font-bold text-rs-primary-text mb-6">Preferred Tenant</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-rs-secondary-text">Gender</span>
                <span className="font-semibold text-rs-primary-text capitalize">{room.preferredTenant?.gender}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-rs-secondary-text">Diet</span>
                <span className="font-semibold text-rs-primary-text capitalize">{room.preferredTenant?.diet}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-rs-secondary-text">Cleanliness</span>
                <span className="font-semibold text-rs-primary-text capitalize">{room.preferredTenant?.cleanliness}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-rs-secondary-text">Smoking</span>
                <span className="font-semibold text-rs-primary-text">
                  {room.preferredTenant?.smoking ? <Check size={18} className="text-green-500" /> : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OwnerCard owner={room.owner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
