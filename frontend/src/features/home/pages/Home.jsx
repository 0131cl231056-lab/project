import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  HeartHandshake,
  BedDouble,
  Users,
  Sparkles,
  ShieldCheck,
  Search,
  MapPin,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Home as HomeIcon,
  Moon,
  Utensils,
  Volume2,
  BookOpen,
  Briefcase,
  Compass,
  Sparkle,
} from 'lucide-react';
import RoomCard from '../../../components/room/RoomCard';
import { CardSkeleton } from '../../../components/room/LoadingSkeletons';
import { useRoom } from '../../room/hook/useRoom';

const POPULAR_CITIES = [
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi NCR' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Noida', state: 'Uttar Pradesh' },
];

const LIFESTYLE_FACTORS = [
  { label: 'Sleep schedule', icon: Moon, detail: 'Early Bird vs. Night Owl routines' },
  { label: 'Dietary preference', icon: Utensils, detail: 'Vegetarian, Vegan, or Non-Veg' },
  { label: 'Cleanliness standard', icon: Sparkle, detail: 'High, Moderate, or Relaxed' },
  { label: 'Smoking boundary', icon: ShieldCheck, detail: 'Smoke-free or Smoking allowed' },
  { label: 'Drinking boundary', icon: ShieldCheck, detail: 'Non-drinker or Social drinking' },
  { label: 'Pet friendliness', icon: HeartHandshake, detail: 'Pet-friendly or Allergy-safe' },
  { label: 'Guest frequency', icon: Users, detail: 'Quiet downtime vs. Weekend visitors' },
  { label: 'Noise tolerance', icon: Volume2, detail: 'Quiet retreat vs. Active sound' },
  { label: 'Study environment', icon: BookOpen, detail: 'Silent focus vs. Collaborative' },
  { label: 'Work schedule', icon: Briefcase, detail: 'Office, Student, Hybrid, or WFH' },
  { label: 'Sharing preference', icon: BedDouble, detail: 'Private room vs. Shared room' },
];

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const rooms = useSelector((state) => state.room.rooms);
  const loading = useSelector((state) => state.room.loading);
  const { handleGetAllRooms } = useRoom();

  // Search form state
  const [searchCity, setSearchCity] = useState('');
  const [searchRoomType, setSearchRoomType] = useState('');
  const [searchMaxRent, setSearchMaxRent] = useState('');

  // Fetch real rooms on mount
  useEffect(() => {
    handleGetAllRooms().catch(() => {
      // Safely catch if user is unauthenticated or network fails
    });
  }, []);

  // Handle hero room search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.set('city', searchCity.trim());
    if (searchRoomType) params.set('roomType', searchRoomType);
    if (searchMaxRent) params.set('maxRent', searchMaxRent);

    navigate(`/rooms?${params.toString()}`);
  };

  // Dynamically resolve city counts from loaded backend rooms
  const cityCounts = useMemo(() => {
    const counts = {};
    if (Array.isArray(rooms)) {
      rooms.forEach((r) => {
        if (r.city) {
          const key = r.city.trim().toLowerCase();
          counts[key] = (counts[key] || 0) + 1;
        }
      });
    }
    return counts;
  }, [rooms]);

  // Merge backend cities with known demo cities so list is always complete & dynamic
  const displayedCities = useMemo(() => {
    const cityMap = new Map();
    POPULAR_CITIES.forEach((c) => cityMap.set(c.name.toLowerCase(), c));

    if (Array.isArray(rooms)) {
      rooms.forEach((r) => {
        if (r.city && !cityMap.has(r.city.toLowerCase())) {
          cityMap.set(r.city.toLowerCase(), {
            name: r.city,
            state: r.state || 'India',
          });
        }
      });
    }

    return Array.from(cityMap.values());
  }, [rooms]);

  // Featured rooms: slice 4-6 real rooms from backend
  const featuredRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) return [];
    return rooms.slice(0, 6);
  }, [rooms]);

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 shadow-xs text-xs sm:text-sm font-medium text-[#C27A62]">
                <Sparkles className="w-4 h-4 text-[#C27A62]" />
                <span>The Roommate Compatibility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#4A3B32] tracking-tight leading-[1.12]">
                Find a Room.{' '}
                <span className="block text-[#C27A62]">Find Your Perfect Roommate.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#8B7E74] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover rooms and people that match your lifestyle, preferences, and budget.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/rooms"
                  className="px-8 py-3.5 rounded-xl bg-[#C27A62] text-[#FDFAF6] font-semibold hover:bg-[#B36952] transition-all shadow-md shadow-[#C27A62]/20 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  Find a Room
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={user ? (user.role === 'owner' ? '/create-room' : '/create-room') : '/register'}
                  className="px-8 py-3.5 rounded-xl border-2 border-[#C27A62] text-[#C27A62] font-semibold hover:bg-[#C27A62] hover:text-[#FDFAF6] transition-all transform hover:-translate-y-0.5"
                >
                  List Your Room
                </Link>

                {user?.role === 'owner' && (
                  <Link
                    to="/owner/my-rooms"
                    className="px-5 py-3.5 rounded-xl text-sm font-semibold text-[#4A3B32] hover:bg-[#FDFAF6] transition-colors inline-flex items-center gap-1.5"
                  >
                    My Listings <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Highlights pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-[#8B7E74]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C27A62]" />
                  <span>Verified House Rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C27A62]" />
                  <span>Transparent Rent & Amenities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C27A62]" />
                  <span>Lifestyle Matching</span>
                </div>
              </div>
            </div>

            {/* Right Visual (Tasteful, balanced, not dominating) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-[#4A3B32]/10 border border-[#8B7E74]/15 bg-white aspect-[4/3] sm:aspect-[1/1]">
                  <img
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
                    alt="Comfortable shared living space"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B32]/60 via-transparent to-transparent" />

                  {/* Room details inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 text-[#FDFAF6]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                          Bhopal • Single Room
                        </span>
                        <p className="font-bold text-base sm:text-lg">Peaceful Study-Friendly Space</p>
                      </div>
                      <div className="bg-[#FDFAF6] text-[#4A3B32] px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                        ₹8,000<span className="text-[10px] font-normal text-[#8B7E74]">/mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Card 1: Compatibility Score */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-[#FDFAF6] border border-[#8B7E74]/15 rounded-2xl p-3 shadow-lg shadow-[#4A3B32]/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-extrabold text-sm">
                    94%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A3B32]">Compatibility Match</p>
                    <p className="text-[11px] text-[#8B7E74]">Habits & Schedule Aligned</p>
                  </div>
                </div>

                {/* Floating Micro-Card 2: Lifestyle Tags */}
                <div className="absolute -bottom-5 -left-2 sm:-left-4 bg-[#FDFAF6] border border-[#8B7E74]/15 rounded-2xl p-3 shadow-lg shadow-[#4A3B32]/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#C27A62] text-[#FDFAF6] flex items-center justify-center text-xs font-bold">
                    RS
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#4A3B32]">Verified Roommates</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8B7E74] font-medium mt-0.5">
                      <span className="bg-[#F5F2E9] px-1.5 py-0.5 rounded">Early Bird</span>
                      <span className="bg-[#F5F2E9] px-1.5 py-0.5 rounded">Clean</span>
                      <span className="bg-[#F5F2E9] px-1.5 py-0.5 rounded">Quiet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROOM SEARCH SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFAF6] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4A3B32]/5 border border-[#8B7E74]/15">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8B7E74]/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#4A3B32]">
                Find Your Next Space
              </h2>
              <p className="text-sm text-[#8B7E74] mt-0.5">
                Search rooms by location, type, and rent limit
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8B7E74]">
              <Compass className="w-4 h-4 text-[#C27A62]" />
              <span>Direct Filters • Real-Time Availability</span>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* City Input */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3B32] uppercase tracking-wider mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C27A62]" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="e.g. Bhopal, Indore, Pune"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#8B7E74]/20 focus:border-[#C27A62] focus:ring-2 focus:ring-[#C27A62]/20 text-sm text-[#4A3B32] outline-none transition-all placeholder:text-[#8B7E74]/60"
                  />
                </div>
              </div>

              {/* Room Type Select */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3B32] uppercase tracking-wider mb-2">
                  Room Type
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C27A62]" />
                  <select
                    value={searchRoomType}
                    onChange={(e) => setSearchRoomType(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl bg-white border border-[#8B7E74]/20 focus:border-[#C27A62] focus:ring-2 focus:ring-[#C27A62]/20 text-sm text-[#4A3B32] outline-none transition-all appearance-none"
                  >
                    <option value="">All Room Types</option>
                    <option value="Single">Single / Private Room</option>
                    <option value="Shared">Shared Room</option>
                    <option value="Double">Double Room</option>
                  </select>
                </div>
              </div>

              {/* Maximum Rent Select */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3B32] uppercase tracking-wider mb-2">
                  Maximum Rent
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#C27A62]">
                    ₹
                  </span>
                  <select
                    value={searchMaxRent}
                    onChange={(e) => setSearchMaxRent(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl bg-white border border-[#8B7E74]/20 focus:border-[#C27A62] focus:ring-2 focus:ring-[#C27A62]/20 text-sm text-[#4A3B32] outline-none transition-all appearance-none"
                  >
                    <option value="">Any Budget</option>
                    <option value="6000">Up to ₹6,000 / mo</option>
                    <option value="8000">Up to ₹8,000 / mo</option>
                    <option value="10000">Up to ₹10,000 / mo</option>
                    <option value="15000">Up to ₹15,000 / mo</option>
                    <option value="25000">Up to ₹25,000 / mo</option>
                  </select>
                </div>
              </div>

              {/* Search Rooms Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-[#C27A62] hover:bg-[#B36952] text-[#FDFAF6] font-semibold text-sm transition-all shadow-md shadow-[#C27A62]/20 flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Search Rooms
                </button>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#8B7E74]">
              <span className="font-medium text-[#4A3B32]">Popular locations:</span>
              {['Bhopal', 'Indore', 'Pune', 'Bangalore'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSearchCity(c)}
                  className={`px-2.5 py-1 rounded-full border transition-colors ${
                    searchCity.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#C27A62] text-[#FDFAF6] border-[#C27A62]'
                      : 'bg-white border-[#8B7E74]/20 hover:border-[#C27A62] text-[#4A3B32]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* 3. WHY ROOMSYNC SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 text-xs font-semibold text-[#C27A62] mb-3">
            Built For Real Co-Living
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3B32] tracking-tight">
            More Than Just Finding a Room
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8B7E74] leading-relaxed">
            Finding four walls is simple. Finding roommates who respect your sleep schedule, dietary needs, and study silence is where RoomSync shines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Card 1 */}
          <Link to="/rooms" className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2E9] text-[#C27A62] flex items-center justify-center mb-6 group-hover:bg-[#C27A62] group-hover:text-[#FDFAF6] transition-colors duration-300">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2.5">Find Your Room</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed">
              Browse rooms based on location, rent, room type and amenities.
            </p>
          </Link>

          {/* Card 2 */}
          <Link to="/find-roommates" className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2E9] text-[#C27A62] flex items-center justify-center mb-6 group-hover:bg-[#C27A62] group-hover:text-[#FDFAF6] transition-colors duration-300">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2.5">Find Compatible Roommates</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed">
              Discover people with similar lifestyles and preferences.
            </p>
          </Link>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2E9] text-[#C27A62] flex items-center justify-center mb-6 group-hover:bg-[#C27A62] group-hover:text-[#FDFAF6] transition-colors duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2.5">Compatibility Score</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed">
              Understand how well a room or roommate matches your preferences.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2E9] text-[#C27A62] flex items-center justify-center mb-6 group-hover:bg-[#C27A62] group-hover:text-[#FDFAF6] transition-colors duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2.5">Simple & Convenient</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed">
              Manage your profile, rooms and preferences in one place.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED ROOMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 text-xs font-semibold text-[#C27A62] mb-2">
              Verified Accommodations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3B32] tracking-tight">
              Explore Featured Rooms
            </h2>
            <p className="mt-1 text-sm sm:text-base text-[#8B7E74]">
              Real listings directly from property owners and roommates with compatibility insights.
            </p>
          </div>

          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C27A62] hover:text-[#B36952] transition-colors group self-start sm:self-auto"
          >
            <span>View All Rooms</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : featuredRooms.length > 0 ? (
          /* Real Backend Rooms Display */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          /* Empty / Unauthenticated State handled properly */
          <div className="bg-[#FDFAF6] border border-[#8B7E74]/20 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#C27A62] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <BedDouble className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#4A3B32] mb-2">
              Explore Rooms Matched to You
            </h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed mb-6 max-w-md mx-auto">
              Sign in to browse all verified spaces, compute real-time compatibility scores, and contact owners directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/rooms"
                className="px-6 py-3 rounded-xl bg-[#C27A62] text-[#FDFAF6] font-semibold text-sm hover:bg-[#B36952] transition-colors shadow-sm"
              >
                Browse Rooms
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-[#4A3B32] text-[#4A3B32] font-semibold text-sm hover:bg-[#4A3B32] hover:text-white transition-colors"
                >
                  Sign In to Calculate Match
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom View All Link for Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C27A62] text-[#C27A62] font-semibold text-sm"
          >
            View All Rooms →
          </Link>
        </div>
      </section>

      {/* 5. COMPATIBILITY SECTION (Strong differentiator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFAF6] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#8B7E74]/15 shadow-xl shadow-[#4A3B32]/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2E9] text-xs font-bold text-[#C27A62]">
                <Sparkles className="w-4 h-4" />
                <span>The Core of RoomSync</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4A3B32] tracking-tight">
                Your Lifestyle Matters
              </h2>

              <p className="text-lg sm:text-xl font-medium text-[#4A3B32] leading-relaxed">
                Finding a room is easy. Finding a place where you actually feel comfortable is harder.
              </p>

              <p className="text-sm sm:text-base text-[#8B7E74] leading-relaxed">
                Most conflicts between roommates don't happen over rent — they happen over dirty dishes at 2 AM, sudden overnight guests, conflicting sleep cycles, or incompatible study environments. RoomSync evaluates these dimensions before you ever sign a lease.
              </p>

              {/* 11 Compatibility Factors Grid */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#4A3B32] uppercase tracking-wider mb-4">
                  11 Dimensions Evaluated by RoomSync:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LIFESTYLE_FACTORS.map((factor) => {
                    const IconComp = factor.icon;
                    return (
                      <div
                        key={factor.label}
                        className="bg-white rounded-xl p-3 border border-gray-100 flex items-start gap-2.5 shadow-2xs hover:border-[#C27A62]/40 transition-colors"
                      >
                        <div className="p-1 rounded-lg bg-[#F5F2E9] text-[#C27A62] shrink-0 mt-0.5">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#4A3B32] truncate">{factor.label}</p>
                          <p className="text-[10px] text-[#8B7E74] truncate">{factor.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/preferences"
                  className="px-6 py-3 rounded-xl bg-[#4A3B32] text-[#FDFAF6] font-semibold text-sm hover:bg-[#3D3028] transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  Set Your Lifestyle Preferences
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="text-sm font-semibold text-[#C27A62] hover:text-[#B36952] transition-colors"
                  >
                    Create Free Profile →
                  </Link>
                )}
              </div>
            </div>

            {/* Right Visual Compatibility Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm space-y-4">
                {/* Visual Sample Compatibility Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#4A3B32]/10 border border-[#8B7E74]/15 relative overflow-hidden">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#C27A62]/10 rounded-bl-full pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C27A62]">
                        Match Analysis
                      </span>
                      <h3 className="text-xl font-extrabold text-[#4A3B32]">Compatibility</h3>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-green-100 text-green-700 font-extrabold text-lg shadow-2xs">
                        92%
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#8B7E74] mb-6">
                    Strong lifestyle compatibility calculated based on mutual daily habits and house boundaries.
                  </p>

                  {/* Checklist items requested by user */}
                  <div className="space-y-3 border-t border-b border-gray-100 py-4 mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#4A3B32] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Sleep Schedule
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Early Bird
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#4A3B32] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Cleanliness
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        High Standard
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#4A3B32] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Study Environment
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Quiet Focus
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#4A3B32] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Work Schedule
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Day Office
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#4A3B32] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        Lifestyle
                      </span>
                      <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Mutual Respect
                      </span>
                    </div>
                  </div>

                  {/* Footnote */}
                  <p className="text-[11px] text-[#8B7E74] italic leading-tight">
                    * Visual demonstration of RoomSync's algorithmic matching between roommates.
                  </p>
                </div>

                {/* Real User Context Preview (When Logged In) */}
                {user?.preferences && (
                  <div className="bg-[#F5F2E9] rounded-2xl p-4 border border-[#8B7E74]/20 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#4A3B32]">Your Active Preferences</span>
                      <Link to="/preferences" className="text-[#C27A62] font-semibold hover:underline">
                        Edit
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#8B7E74]">
                      <div>
                        Sleep:{' '}
                        <span className="font-semibold text-[#4A3B32] capitalize">
                          {user.preferences.sleepSchedule || 'Early Bird'}
                        </span>
                      </div>
                      <div>
                        Diet:{' '}
                        <span className="font-semibold text-[#4A3B32] capitalize">
                          {user.preferences.diet || 'Vegetarian'}
                        </span>
                      </div>
                      <div>
                        Cleanliness:{' '}
                        <span className="font-semibold text-[#4A3B32] capitalize">
                          {user.preferences.cleanliness || 'Medium'}
                        </span>
                      </div>
                      <div>
                        Work:{' '}
                        <span className="font-semibold text-[#4A3B32] capitalize">
                          {user.preferences.workSchedule || 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POPULAR CITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 text-xs font-semibold text-[#C27A62] mb-2">
            Explore Destinations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3B32] tracking-tight">
            Find Rooms in Popular Cities
          </h2>
          <p className="mt-3 text-base text-[#8B7E74]">
            Browse rooms and compatible roommates in top university and corporate technology centers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {displayedCities.map((city) => {
            const count = cityCounts[city.name.toLowerCase()] || 0;
            return (
              <div
                key={city.name}
                onClick={() => navigate(`/rooms?city=${encodeURIComponent(city.name)}`)}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#C27A62]/40 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#F5F2E9] text-[#C27A62] group-hover:bg-[#C27A62] group-hover:text-[#FDFAF6] flex items-center justify-center transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#4A3B32] group-hover:text-[#C27A62] transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs text-[#8B7E74]">{city.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8B7E74] bg-[#FDFAF6] px-2.5 py-1 rounded-full border border-[#8B7E74]/15">
                    {count > 0 ? `${count} ${count === 1 ? 'room' : 'rooms'}` : 'Explore'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8B7E74] group-hover:text-[#C27A62] transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 text-xs font-semibold text-[#C27A62] mb-2">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3B32] tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base text-[#8B7E74]">
            Three steps to find a room and a living situation that truly fits your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative flex flex-col items-start hover:shadow-md transition-shadow">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C27A62]/30 mb-4 block">
              01
            </span>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2">Set Your Preferences</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed mb-4">
              Tell RoomSync about your lifestyle.
            </p>
            <p className="text-xs text-[#8B7E74]/80 leading-relaxed mt-auto">
              Answer quick questions about your schedule, cleanliness, study vibe, and daily habits so our compatibility engine can work for you.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative flex flex-col items-start hover:shadow-md transition-shadow">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C27A62]/30 mb-4 block">
              02
            </span>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2">Explore Rooms</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed mb-4">
              Discover rooms that fit your requirements.
            </p>
            <p className="text-xs text-[#8B7E74]/80 leading-relaxed mt-auto">
              Filter available spaces by location, rent, amenities, and room type with clear pricing and verified property owner details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative flex flex-col items-start hover:shadow-md transition-shadow">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#C27A62]/30 mb-4 block">
              03
            </span>
            <h3 className="text-xl font-bold text-[#4A3B32] mb-2">Find Your Match</h3>
            <p className="text-sm text-[#8B7E74] leading-relaxed mb-4">
              Use compatibility to find a better living situation.
            </p>
            <p className="text-xs text-[#8B7E74]/80 leading-relaxed mt-auto">
              Review mutual compatibility scores and connect with confidence, knowing you won't have awkward lifestyle clashes down the road.
            </p>
          </div>
        </div>
      </section>

      {/* 8. OWNER CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4A3B32] text-[#FDFAF6] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C27A62]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDFAF6]/10 border border-[#FDFAF6]/20 text-xs font-semibold text-[#FDFAF6]">
              <HomeIcon className="w-3.5 h-3.5 text-[#C27A62]" />
              For Property Owners & Current Tenants
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Have a Room to Rent?
            </h2>

            <p className="text-base sm:text-lg text-[#FDFAF6]/80 leading-relaxed">
              List your room and connect with people looking for a place like yours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 pb-2 text-xs text-[#FDFAF6]/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C27A62] shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C27A62] shrink-0" />
                <span>Rule-Matched Tenants</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C27A62] shrink-0" />
                <span>Verified Profiles</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to={user ? (user.role === 'owner' ? '/create-room' : '/create-room') : '/login'}
                className="px-8 py-3.5 rounded-xl bg-[#C27A62] text-[#FDFAF6] font-semibold hover:bg-[#B36952] transition-colors shadow-md shadow-black/20"
              >
                List Your Room
              </Link>

              {user?.role === 'owner' && (
                <Link
                  to="/owner/my-rooms"
                  className="px-6 py-3.5 rounded-xl border border-[#FDFAF6]/30 text-[#FDFAF6] font-semibold hover:bg-[#FDFAF6]/10 transition-colors"
                >
                  Manage Your Listings
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FDFAF6] rounded-3xl p-10 sm:p-14 lg:p-16 border border-[#8B7E74]/15 shadow-xl shadow-[#4A3B32]/5 text-center max-w-4xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#C27A62] text-[#FDFAF6] flex items-center justify-center mx-auto shadow-md shadow-[#C27A62]/20">
            <HeartHandshake className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4A3B32] tracking-tight">
            Your Next Home Could Be One Match Away.
          </h2>

          <p className="text-base sm:text-lg text-[#8B7E74] max-w-2xl mx-auto leading-relaxed">
            Explore rooms, discover compatible roommates, and find a place that feels right.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/rooms"
              className="px-8 py-3.5 rounded-xl bg-[#C27A62] text-[#FDFAF6] font-semibold hover:bg-[#B36952] transition-all shadow-md shadow-[#C27A62]/20 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Explore Rooms
              <ArrowRight className="w-4 h-4" />
            </Link>

            {user ? (
              <Link
                to="/preferences"
                className="px-8 py-3.5 rounded-xl border-2 border-[#4A3B32] text-[#4A3B32] font-semibold hover:bg-[#4A3B32] hover:text-[#FDFAF6] transition-colors"
              >
                Update Preferences
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl border-2 border-[#C27A62] text-[#C27A62] font-semibold hover:bg-[#C27A62] hover:text-[#FDFAF6] transition-colors"
              >
                Create Your Profile
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;