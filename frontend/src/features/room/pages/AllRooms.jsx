import React, { useState } from 'react';
import RoomCard from '../../../components/room/RoomCard';
import RoomFilters from '../../../components/room/RoomFilters';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect } from "react"
import { CardSkeleton } from '../../../components/room/LoadingSkeletons';
import { useSelector } from "react-redux"
import { useRoom } from '../hook/useRoom';


const AllRooms = () => {
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { handleGetAllRooms } = useRoom()
  const rooms = useSelector(state => state.room.rooms)
  const loading = useSelector(state => state.room.loading)

  useEffect(() => {
    handleGetAllRooms()
  }, [])
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-rs-primary-text">Find your perfect space</h1>
          <p className="text-rs-secondary-text mt-1">120+ rooms available in your area</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by city, neighborhood..." 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:border-rs-accent focus:ring-2 focus:ring-rs-accent/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            className="md:hidden p-3 bg-white rounded-full border border-gray-200 text-rs-primary-text shadow-sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <RoomFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Room Grid */}
        {
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {rooms.map(room => (
                  <RoomCard key={room._id} room={room} />
                ))}
            </div>
          )
          }
      </div>
    </div>
  );
};

export default AllRooms;
