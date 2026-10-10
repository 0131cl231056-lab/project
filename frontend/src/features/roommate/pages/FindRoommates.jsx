import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import {
  Search,
  SlidersHorizontal,
  Users,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Settings,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useUser } from '../../user/hook/useUser';
import RoommateCard from '../../../components/roommate/RoommateCard';
import RoommateFilters from '../../../components/roommate/RoommateFilters';
import RoommateModal from '../../../components/roommate/RoommateModal';
import { RoommateGridSkeleton } from '../../../components/roommate/RoommateSkeleton';
import {
  getTopLifestyleTags,
  calculateClientCompatibility,
} from '../utils/roommateHelpers';

const ITEMS_PER_PAGE = 9;

const FindRoommates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redux auth & user state
  const authUser = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.user.profile);
  const currentUser = userProfile || authUser;
  const isAuthenticated = Boolean(currentUser);

  // User Hook
  const { handleGetRoommates, roommates, roommatesLoading, roommatesError } = useUser();

  // Local UI states
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('bestMatch');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Fetch roommates from backend
  const fetchRoommates = useCallback(async () => {
    try {
      await handleGetRoommates();
    } catch (err) {
      console.error('Failed to fetch roommates:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoommates();
  }, [fetchRoommates]);

  // Read URL search params
  useEffect(() => {
    const cityParam = searchParams.get('city') || '';
    const searchParam = searchParams.get('search') || '';
    const genderParam = searchParams.get('gender') || '';

    setFilters((prev) => ({
      ...prev,
      city: cityParam || prev.city || '',
      search: searchParam || prev.search || '',
      gender: genderParam || prev.gender || 'any',
    }));
  }, [searchParams]);

  // Current user's lifestyle tags for the personalized section
  const currentUserPreferences = currentUser?.preferences;
  const currentUserLifestyleTags = useMemo(() => {
    return currentUserPreferences ? getTopLifestyleTags(currentUserPreferences) : [];
  }, [currentUserPreferences]);

  // Compute processed, filtered, and sorted roommates
  const processedRoommates = useMemo(() => {
    if (!roommates || !Array.isArray(roommates)) return [];

    const currentUserId = currentUser?._id || currentUser?.id;

    // 1. Filter out non-users & current user
    let list = roommates.filter((roommate) => {
      // Must be role: 'user'
      if (roommate.role !== 'user') return false;

      // Current user should NOT appear in their own results
      const roommateId = roommate._id || roommate.id;
      if (currentUserId && String(roommateId) === String(currentUserId)) {
        return false;
      }

      return true;
    });

    // 2. Client-side re-computation of compatibility if needed
    list = list.map((roommate) => {
      let compatibility = roommate.compatibility;
      let compatibilityBreakdown = roommate.compatibilityBreakdown || [];

      // If backend didn't compute (e.g. unauthenticated request earlier, or profile loaded later)
      if (
        (compatibility === null || compatibility === undefined) &&
        currentUserPreferences &&
        roommate.preferences
      ) {
        const clientCalc = calculateClientCompatibility(currentUser, roommate);
        compatibility = clientCalc.score;
        compatibilityBreakdown = clientCalc.breakdown;
      }

      return {
        ...roommate,
        compatibility,
        compatibilityBreakdown,
      };
    });

    // 3. Apply Filters
    list = list.filter((roommate) => {
      // Search text (Name, City, State, Bio)
      if (filters.search && filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        const name = (roommate.fullname || '').toLowerCase();
        const city = (roommate.location?.city || '').toLowerCase();
        const state = (roommate.location?.state || '').toLowerCase();
        const bio = (roommate.bio || '').toLowerCase();

        if (
          !name.includes(query) &&
          !city.includes(query) &&
          !state.includes(query) &&
          !bio.includes(query)
        ) {
          return false;
        }
      }

      // City filter
      if (filters.city && filters.city.trim()) {
        const cityQuery = filters.city.trim().toLowerCase();
        const city = (roommate.location?.city || '').toLowerCase();
        const state = (roommate.location?.state || '').toLowerCase();
        if (!city.includes(cityQuery) && !state.includes(cityQuery)) {
          return false;
        }
      }

      // Gender filter
      if (filters.gender && filters.gender !== 'any') {
        const targetGender = filters.gender.toLowerCase();
        const userGender = (roommate.gender || '').toLowerCase();
        if (userGender !== targetGender) {
          return false;
        }
      }

      // Age range
      if (filters.minAge && Number(filters.minAge) > 0) {
        if ((roommate.age || 0) < Number(filters.minAge)) {
          return false;
        }
      }
      if (filters.maxAge && Number(filters.maxAge) > 0) {
        if ((roommate.age || 0) > Number(filters.maxAge)) {
          return false;
        }
      }

      // Lifestyle: Sleep Schedule
      if (filters.sleepSchedule) {
        if (roommate.preferences?.sleepSchedule !== filters.sleepSchedule) {
          return false;
        }
      }

      // Lifestyle: Diet
      if (filters.diet) {
        if (roommate.preferences?.diet !== filters.diet) {
          return false;
        }
      }

      // Lifestyle: Cleanliness
      if (filters.cleanliness) {
        if (roommate.preferences?.cleanliness !== filters.cleanliness) {
          return false;
        }
      }

      // Lifestyle: Smoking
      if (filters.smoking !== undefined && filters.smoking !== '') {
        const wantsNonSmoker = filters.smoking === 'false';
        if (wantsNonSmoker && roommate.preferences?.smoking === true) {
          return false;
        }
        if (!wantsNonSmoker && roommate.preferences?.smoking === false) {
          return false;
        }
      }

      // Lifestyle: Drinking
      if (filters.drinking !== undefined && filters.drinking !== '') {
        const wantsNonDrinker = filters.drinking === 'false';
        if (wantsNonDrinker && roommate.preferences?.drinking === true) {
          return false;
        }
      }

      // Lifestyle: Pets
      if (filters.pets !== undefined && filters.pets !== '') {
        const wantsPets = filters.pets === 'true';
        if (wantsPets && roommate.preferences?.pets === false) {
          return false;
        }
      }

      // Living: Work Schedule
      if (filters.workSchedule) {
        if (roommate.preferences?.workSchedule !== filters.workSchedule) {
          return false;
        }
      }

      // Living: Study Environment
      if (filters.studyEnvironment) {
        if (roommate.preferences?.studyEnvironment !== filters.studyEnvironment) {
          return false;
        }
      }

      // Living: Noise Tolerance
      if (filters.noiseTolerance) {
        if (roommate.preferences?.noiseTolerance !== filters.noiseTolerance) {
          return false;
        }
      }

      // Living: Guest Frequency
      if (filters.guestFrequency) {
        if (roommate.preferences?.guestFrequency !== filters.guestFrequency) {
          return false;
        }
      }

      // Living: Sharing Preference
      if (filters.sharingPreference) {
        if (roommate.preferences?.sharingPreference !== filters.sharingPreference) {
          return false;
        }
      }

      return true;
    });

    // 4. Sort Options (Section 3)
    const sorted = [...list];
    if (sortBy === 'bestMatch' || sortBy === 'compatibility') {
      sorted.sort((a, b) => {
        const compA = a.compatibility !== null && a.compatibility !== undefined ? a.compatibility : -1;
        const compB = b.compatibility !== null && b.compatibility !== undefined ? b.compatibility : -1;
        if (compB !== compA) {
          return compB - compA;
        }
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    } else if (sortBy === 'ageAsc') {
      sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else if (sortBy === 'ageDesc') {
      sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    } else if (sortBy === 'recent') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return sorted;
  }, [roommates, currentUser, currentUserPreferences, filters, sortBy]);

  // Visible sliced roommates for pagination
  const visibleRoommates = useMemo(() => {
    return processedRoommates.slice(0, visibleCount);
  }, [processedRoommates, visibleCount]);

  // Handle Search Input with URL sync
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({ ...prev, search: val }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set('search', val);
      else next.delete('search');
      return next;
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setSearchParams({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '' && v !== 'any'
  );

  return (
    <div className="min-h-screen bg-[#F5F2E9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ============================================================ */}
        {/* 1. PAGE HEADER (Section 1)                                    */}
        {/* ============================================================ */}
        <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDFAF6] border border-[#8B7E74]/20 text-[#C27A62] text-xs sm:text-sm font-semibold mb-4 shadow-2xs">
            <Sparkles size={16} />
            Lifestyle-Based Roommate Matching
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4A3B32] tracking-tight leading-tight">
            Find Your Perfect Roommate
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#8B7E74] font-medium leading-relaxed">
            Discover people who match your lifestyle, habits, and living preferences.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-[#4A3B32]/75 max-w-2xl mx-auto">
            RoomSync helps you find roommates based on more than location — we compare the way you live.
          </p>
        </header>

        {/* ============================================================ */}
        {/* 18. PERSONALIZED SECTION (Section 18)                         */}
        {/* ============================================================ */}
        {isAuthenticated && currentUserPreferences && currentUserLifestyleTags.length > 0 ? (
          <section className="bg-[#FDFAF6] rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="text-[#C27A62]" size={20} />
                  <h2 className="text-lg font-bold text-[#4A3B32]">
                    Your Roommate Preferences
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#8B7E74] mt-0.5">
                  Roommates below are ranked by compatibility with your daily living routine.
                </p>

                {/* Preference tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentUserLifestyleTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F2E9] text-[#4A3B32] border border-[#8B7E74]/20"
                    >
                      <span>{tag.emoji}</span>
                      <span>{tag.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Edit Preferences */}
              <button
                type="button"
                onClick={() => navigate('/preferences')}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#C27A62] text-[#C27A62] bg-[#FDFAF6] hover:bg-[#C27A62] hover:text-white text-xs sm:text-sm font-bold transition-all shadow-2xs self-start md:self-auto"
              >
                <Settings size={16} />
                Edit Preferences
              </button>
            </div>
          </section>
        ) : isAuthenticated && (!currentUserPreferences || currentUserLifestyleTags.length === 0) ? (
          <section className="bg-[#FDFAF6] rounded-2xl p-5 sm:p-6 border border-[#C27A62]/30 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#4A3B32]">
                  Set your preferences to calculate roommate compatibility
                </h3>
                <p className="text-xs sm:text-sm text-[#8B7E74] mt-0.5">
                  Answer a few questions about your sleep, cleanliness, and diet to see accurate match scores.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/preferences')}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C27A62] text-white text-xs sm:text-sm font-bold hover:bg-[#B36952] transition-colors shadow-sm self-start sm:self-auto"
            >
              Set Preferences
            </button>
          </section>
        ) : (
          <section className="bg-[#FDFAF6] rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#F5F2E9] text-[#C27A62] shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#4A3B32]">
                  Sign in for personalized roommate compatibility
                </h3>
                <p className="text-xs sm:text-sm text-[#8B7E74] mt-0.5">
                  Log in to compare sleep schedules, cleanliness habits, and dietary choices with potential roommates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C27A62] text-white text-xs sm:text-sm font-bold hover:bg-[#B36952] transition-colors shadow-sm self-start sm:self-auto"
            >
              Log In to Compare
            </button>
          </section>
        )}

        {/* ============================================================ */}
        {/* SEARCH, RESULTS STATS & SORT BAR                              */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input (Section 14) */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Search roommates by name or city..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F2E9]/60 border border-transparent focus:border-[#C27A62] focus:bg-white outline-none transition-all text-sm text-[#4A3B32]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Controls: Mobile Filter Toggle + Sort Options (Section 3) */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F2E9] border border-[#8B7E74]/20 text-xs sm:text-sm font-bold text-[#4A3B32] hover:bg-gray-100 transition-colors"
            >
              <SlidersHorizontal size={16} className="text-[#C27A62]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#C27A62]" />
              )}
            </button>

            {/* Sort Dropdown (Section 3) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8B7E74] hidden sm:inline flex items-center gap-1">
                <ArrowUpDown size={14} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#F5F2E9]/70 border border-transparent focus:border-[#C27A62] focus:bg-white text-xs sm:text-sm font-semibold text-[#4A3B32] outline-none cursor-pointer"
              >
                <option value="bestMatch">Best Match</option>
                <option value="compatibility">Highest Compatibility</option>
                <option value="ageAsc">Age: Low to High</option>
                <option value="ageDesc">Age: High to Low</option>
                <option value="recent">Recently Joined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter and Active Filter Tags */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm font-semibold text-[#8B7E74]">
            {roommatesLoading ? (
              'Discovering compatible roommates...'
            ) : (
              <span>
                Showing <strong className="text-[#4A3B32]">{processedRoommates.length}</strong>{' '}
                {processedRoommates.length === 1 ? 'potential roommate' : 'potential roommates'}
              </span>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-[#C27A62] hover:underline flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* MAIN BODY: SIDEBAR FILTERS + ROOMMATE GRID                    */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar (Section 2) */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            <RoommateFilters
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
              totalCount={processedRoommates.length}
            />
          </aside>

          {/* Roommates Grid Container */}
          <main className="flex-1 w-full">
            {/* 16. LOADING STATE */}
            {roommatesLoading ? (
              <RoommateGridSkeleton count={6} />
            ) : roommatesError ? (
              /* 17. ERROR STATE */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-red-100 shadow-sm max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#4A3B32] mb-2">
                  Unable to load roommates
                </h3>
                <p className="text-sm text-[#8B7E74] mb-6 leading-relaxed">
                  Something went wrong while fetching roommate profiles. Please try again.
                </p>
                <button
                  type="button"
                  onClick={fetchRoommates}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C27A62] text-white font-semibold hover:bg-[#B36952] transition-colors shadow-sm"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
              </div>
            ) : processedRoommates.length > 0 ? (
              /* 4. ROOMMATE GRID (Section 4) */
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleRoommates.map((roommate) => (
                    <RoommateCard
                      key={roommate._id || roommate.id}
                      roommate={roommate}
                      onSelect={(rm) => setSelectedRoommate(rm)}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>

                {/* Pagination / Load More (Section 19) */}
                {visibleCount < processedRoommates.length && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white border border-[#8B7E74]/20 text-[#4A3B32] font-bold text-sm hover:bg-[#FDFAF6] hover:border-[#C27A62] transition-all shadow-sm"
                    >
                      Load More Roommates ({processedRoommates.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 15. EMPTY STATE (Section 15) */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F2E9] text-[#C27A62] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#4A3B32] mb-2">
                  No compatible roommates found
                </h3>
                <p className="text-sm text-[#8B7E74] max-w-md mx-auto mb-6 leading-relaxed">
                  Try changing your filters or preferences to discover more people.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C27A62] text-white font-semibold hover:bg-[#B36952] transition-colors shadow-sm"
                >
                  <RotateCcw size={16} />
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FILTER MODAL / DRAWER (Section 2 & 22)                */}
      {/* ============================================================ */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            <RoommateFilters
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
              totalCount={processedRoommates.length}
              isMobile={true}
              onCloseMobile={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. DETAILED ROOMMATE MODAL & BREAKDOWN (Section 8)            */}
      {/* ============================================================ */}
      {selectedRoommate && (
        <RoommateModal
          roommate={selectedRoommate}
          isOpen={Boolean(selectedRoommate)}
          onClose={() => setSelectedRoommate(null)}
          currentUser={currentUser}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default FindRoommates;
