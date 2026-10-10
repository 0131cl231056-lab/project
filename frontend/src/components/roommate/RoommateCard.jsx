import { MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { getTopLifestyleTags, getCompatibilityBadgeStyle } from '../../features/roommate/utils/roommateHelpers';

const DEFAULT_AVATAR = "https://ik.imagekit.io/flgbjchio/userimage.jpeg?updatedAt=1775172780768";

const RoommateCard = ({ roommate, onSelect, isAuthenticated }) => {
  if (!roommate) return null;

  const {
    fullname = "Roommate",
    age,
    gender,
    location,
    bio,
    profilePicture,
    preferences = {},
    compatibility,
  } = roommate;

  const city = location?.city || "City not set";
  const state = location?.state ? `, ${location.state}` : "";
  const formattedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "";
  const ageAndGender = [age ? `${age} yrs` : null, formattedGender].filter(Boolean).join(" • ");

  const lifestyleTags = getTopLifestyleTags(preferences);
  const badgeStyle = getCompatibilityBadgeStyle(compatibility);

  return (
    <div
      onClick={() => onSelect && onSelect(roommate)}
      className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#8B7E74]/15 hover:border-[#C27A62]/50 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Top Section: Avatar + Name + Compatibility Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F5F2E9] border-2 border-white shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src={profilePicture || DEFAULT_AVATAR}
                alt={fullname}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Demographic */}
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-[#4A3B32] group-hover:text-[#C27A62] transition-colors truncate">
                {fullname}
              </h3>
              {ageAndGender && (
                <p className="text-xs sm:text-sm font-medium text-[#8B7E74]">
                  {ageAndGender}
                </p>
              )}
            </div>
          </div>

          {/* Compatibility Badge */}
          {compatibility !== null && compatibility !== undefined ? (
            <div
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{compatibility}% Match</span>
            </div>
          ) : (
            <div className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F5F2E9] text-[#8B7E74] border border-[#8B7E74]/15">
              {isAuthenticated ? "Set Prefs" : "Verified User"}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-xs sm:text-sm text-[#8B7E74] mb-3 gap-1">
          <MapPin size={14} className="text-[#C27A62] shrink-0" />
          <span className="truncate">
            {city}
            {state}
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-[#4A3B32]/85 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
          {bio || "Looking for a compatible roommate with shared living values and habits."}
        </p>

        {/* Lifestyle Tags Summary (Section 7) */}
        {lifestyleTags.length > 0 && (
          <div className="pt-3 border-t border-gray-100 mb-4">
            <div className="flex flex-wrap gap-1.5">
              {lifestyleTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F5F2E9] text-[#4A3B32] border border-[#8B7E74]/15 group-hover:border-[#C27A62]/30 transition-colors"
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Action (Section 9) */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-[#8B7E74] font-medium">
          {preferences.sharingPreference === "privateRoom"
            ? "Prefers Private Room"
            : preferences.sharingPreference === "shareRoom"
            ? "Open to Shared Room"
            : "Roommate"}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(roommate);
          }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#C27A62] hover:text-[#B36952] transition-colors py-1 px-2 rounded-lg hover:bg-[#F5F2E9]"
        >
          View Profile
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoommateCard;
