import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import RoomCard from '../../../components/room/RoomCard';
import RoomFilters from '../../../components/room/RoomFilters';
import { Search, SlidersHorizontal, BedDouble, RotateCcw } from 'lucide-react';
import { CardSkeleton } from '../../../components/room/LoadingSkeletons';
import { useSelector } from 'react-redux';
import { useRoom } from '../hook/useRoom';

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { handleGetAllRooms } = useRoom();
  const rooms = useSelector((state) => state.room.rooms);
  const loading = useSelector((state) => state.room.loading);

  useEffect(() => {
    handleGetAllRooms();
  }, []);

  // Combine URL search params and local filter overrides
  const activeFilters = useMemo(() => {
    const cityParam = searchParams.get('city') || '';
    const roomTypeParam = searchParams.get('roomType') || '';
    const maxRentParam = searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : '';

    return {
      ...filters,
      city: filters.city !== undefined ? filters.city : cityParam,
      roomType: filters.roomType !== undefined ? filters.roomType : roomTypeParam,
      maxRent: filters.maxRent !== undefined ? filters.maxRent : maxRentParam,
    };
  }, [searchParams, filters]);

  // Compute filtered rooms
  const filteredRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) return [];

    return rooms.filter((room) => {
      // City search
      if (activeFilters.city) {
        const query = activeFilters.city.trim().toLowerCase();
        const city = (room.city || '').toLowerCase();
        const address = (room.address || '').toLowerCase();
        const state = (room.state || '').toLowerCase();
        if (!city.includes(query) && !address.includes(query) && !state.includes(query)) {
          return false;
        }
      }

      // Room Type
      if (activeFilters.roomType) {
        const typeQuery = activeFilters.roomType.trim().toLowerCase();
        const roomType = (room.roomType || '').toLowerCase();
        if (!roomType.includes(typeQuery) && !typeQuery.includes(roomType)) {
          return false;
        }
      }

      // Max Rent
      if (activeFilters.maxRent && Number(activeFilters.maxRent) > 0) {
        if (room.rent > Number(activeFilters.maxRent)) {
          return false;
        }
      }

      // Smoking
      if (activeFilters.smoking && room.preferredTenant?.smoking === 'No') {
        return false;
      }

      // Pets
      if (activeFilters.pets && room.preferredTenant?.pets === false) {
        return false;
      }

      // Furnished
      if (activeFilters.furnished) {
        const hasFurnished = room.amenities?.some((a) =>
          a.toLowerCase().includes('furnish')
        );
        if (!hasFurnished) return false;
      }

      return true;
    });
  }, [rooms, activeFilters]);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, city: val }));
    if (val) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('city', val);
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('city');
        return next;
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-rs-primary-text">
            Find your perfect space
          </h1>
          <p className="text-rs-secondary-text mt-1">
            {loading
              ? 'Loading available rooms...'
              : `${filteredRooms.length} ${
                  filteredRooms.length === 1 ? 'room' : 'rooms'
                } available in your area`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by city, neighborhood..."
              value={activeFilters.city || ''}
              onChange={handleSearchInputChange}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:border-rs-accent focus:ring-2 focus:ring-rs-accent/20 outline-none transition-all shadow-sm text-sm"
            />
          </div>
          <button
            className="md:hidden p-3 bg-white rounded-full border border-gray-200 text-rs-primary-text shadow-sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <RoomFilters filters={activeFilters} setFilters={setFilters} />
        </div>

        {/* Room Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-rs-secondary-bg text-rs-accent flex items-center justify-center mx-auto mb-4">
                <BedDouble size={32} />
              </div>
              <h3 className="text-xl font-bold text-rs-primary-text mb-2">
                No rooms match your search
              </h3>
              <p className="text-sm text-rs-secondary-text max-w-md mx-auto mb-6">
                We couldn't find any listings matching your current filter criteria. Try broadening your location, adjusting the rent range, or clearing filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rs-accent text-white font-semibold hover:bg-[#B36952] transition-colors shadow-sm"
              >
                <RotateCcw size={16} />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
