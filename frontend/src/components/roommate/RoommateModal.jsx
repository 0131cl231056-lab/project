import { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Check,
  Calendar,
  Copy,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { getCompatibilityBadgeStyle } from '../../features/roommate/utils/roommateHelpers';

const DEFAULT_AVATAR = "https://ik.imagekit.io/flgbjchio/userimage.jpeg?updatedAt=1775172780768";

const RoommateModal = ({ roommate, isOpen, onClose, isAuthenticated }) => {
  const navigate = useNavigate();
  const [copiedType, setCopiedType] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !roommate) return null;

  const {
    fullname = "Roommate Profile",
    email,
    contact,
    bio,
    age,
    gender,
    location,
    profilePicture,
    preferences = {},
    compatibility,
    compatibilityBreakdown = [],
    createdAt,
  } = roommate;

  const city = location?.city || "Not specified";
  const state = location?.state ? `, ${location.state}` : "";
  const formattedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Not specified";
  const badgeStyle = getCompatibilityBadgeStyle(compatibility);

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const renderBadge = (label, value) => {
    if (value === undefined || value === null || value === '') return null;
    const displayValue =
      typeof value === 'boolean'
        ? value
          ? 'Yes'
          : 'No'
        : String(value)
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

    return (
      <div className="bg-[#F5F2E9] p-3.5 rounded-2xl border border-[#8B7E74]/15 shadow-xs flex flex-col group">
        <span className="text-[11px] text-[#8B7E74] mb-1 font-semibold tracking-wider uppercase">
          {label}
        </span>
        <span className="text-sm font-semibold text-[#4A3B32] group-hover:text-[#C27A62] transition-colors">
          {displayValue}
        </span>
      </div>
    );
  };

  const joinedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Window */}
      <div className="relative bg-[#FDFAF6] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#8B7E74]/15 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Cover Graphic Header */}
        <div className="h-28 sm:h-36 bg-[#C27A62] relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A3B32] shadow-md transition-all duration-200 z-10"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 pt-0 flex-1 space-y-6">
          {/* Avatar and Main Header Info */}
          <div className="relative -mt-14 sm:-mt-18 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#8B7E74]/15">
            <div className="flex items-end gap-4 sm:gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#FDFAF6] bg-[#F5F2E9] overflow-hidden shadow-lg shrink-0">
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

              <div className="pb-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3B32] tracking-tight">
                    {fullname}
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-[#F5F2E9] text-[#4A3B32] px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#8B7E74]/20">
                    <ShieldCheck size={14} className="text-[#C27A62]" />
                    Verified User
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#8B7E74] mt-1 flex-wrap">
                  {age && <span>{age} years old</span>}
                  {age && <span>•</span>}
                  <span>{formattedGender}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#C27A62]" />
                    {city}
                    {state}
                  </span>
                  {joinedDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar size={13} /> Joined {joinedDate}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Compatibility Score Pill in Header */}
            {compatibility !== null && compatibility !== undefined && (
              <div
                className={`self-start sm:self-end px-4 py-2 rounded-2xl border font-bold text-sm sm:text-base flex items-center gap-2 shadow-xs ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{compatibility}% Compatibility</span>
              </div>
            )}
          </div>

          {/* Section 8: COMPATIBILITY BREAKDOWN */}
          {compatibility !== null && compatibility !== undefined ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#4A3B32] flex items-center gap-2">
                    <Sparkles className="text-[#C27A62]" size={18} />
                    Compatibility Breakdown
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8B7E74]">
                    Real-time comparison between your lifestyle preferences and {fullname}'s habits.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#C27A62]">
                    {compatibility}%
                  </span>
                  <span className="text-xs text-[#8B7E74] block">Overall Match</span>
                </div>
              </div>

              {/* Match Progress Bar */}
              <div className="w-full bg-[#F5F2E9] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C27A62] to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${compatibility}%` }}
                />
              </div>

              {/* Breakdown Rows (Section 8) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {compatibilityBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-colors ${
                      item.match
                        ? 'bg-emerald-50/60 border-emerald-200/70'
                        : 'bg-[#F5F2E9]/40 border-gray-200/80'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-[#4A3B32] block truncate">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-[#8B7E74] truncate block">
                        You: {item.userValue} • Them: {item.roommateValue}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                        item.match
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      {item.match ? (
                        <>
                          <Check size={13} className="stroke-[3]" /> Match
                        </>
                      ) : (
                        <>
                          <X size={13} /> Difference
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-[#8B7E74]/15 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="font-bold text-[#4A3B32] flex items-center gap-2">
                  <Sparkles className="text-[#C27A62]" size={16} />
                  Want to see your compatibility match?
                </h4>
                <p className="text-xs sm:text-sm text-[#8B7E74] mt-0.5">
                  {isAuthenticated
                    ? "Complete your lifestyle preferences in your profile to calculate match scores."
                    : "Log in and set your living habits to see an automated lifestyle breakdown."}
                </p>
              </div>
              <button
                onClick={() => navigate(isAuthenticated ? "/preferences" : "/login")}
                className="px-4 py-2 rounded-xl bg-[#C27A62] text-white text-xs sm:text-sm font-semibold hover:bg-[#B36952] transition-colors"
              >
                {isAuthenticated ? "Set Preferences" : "Log In"}
              </button>
            </div>
          )}

          {/* Section: ABOUT ME */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#4A3B32]">About Me</h3>
            <p className="text-sm text-[#4A3B32]/90 leading-relaxed whitespace-pre-line">
              {bio || "This user hasn't added a detailed bio yet."}
            </p>

            {/* Quick Contact & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              {email && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F2E9]/60 border border-[#8B7E74]/10">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Mail size={16} className="text-[#C27A62] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#4A3B32] truncate">{email}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(email, 'email')}
                    className="p-1.5 rounded-lg hover:bg-white text-[#8B7E74] hover:text-[#4A3B32] transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedType === 'email' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              )}

              {contact && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F2E9]/60 border border-[#8B7E74]/10">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Phone size={16} className="text-[#C27A62] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#4A3B32] truncate">{contact}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contact, 'contact')}
                    className="p-1.5 rounded-lg hover:bg-white text-[#8B7E74] hover:text-[#4A3B32] transition-colors shrink-0"
                    title="Copy Contact"
                  >
                    {copiedType === 'contact' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section: LIFESTYLE & HABITS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#4A3B32]">Lifestyle & Daily Habits</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {renderBadge('Sleep Schedule', preferences.sleepSchedule)}
              {renderBadge('Diet', preferences.diet)}
              {renderBadge('Cleanliness', preferences.cleanliness)}
              {renderBadge('Smoking', preferences.smoking)}
              {renderBadge('Drinking', preferences.drinking)}
              {renderBadge('Pets', preferences.pets)}
            </div>
          </div>

          {/* Section: LIVING PREFERENCES */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#8B7E74]/15 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#4A3B32]">Living & Cohabitation Preferences</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {renderBadge('Guest Frequency', preferences.guestFrequency)}
              {renderBadge('Noise Tolerance', preferences.noiseTolerance)}
              {renderBadge('Study / Focus', preferences.studyEnvironment)}
              {renderBadge('Work Schedule', preferences.workSchedule)}
              {renderBadge('Sharing Preference', preferences.sharingPreference)}
              {renderBadge('Preferred Gender', preferences.preferredGender)}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#8B7E74]/15 shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-[#4A3B32] hover:bg-[#F5F2E9] transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {email && (
              <a
                href={`mailto:${email}?subject=Hi%20from%20RoomSync!&body=Hi%20${encodeURIComponent(fullname)},%20I%20found%20your%20roommate%20profile%20on%20RoomSync%20and%20wanted%20to%20connect!`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C27A62] text-white text-sm font-semibold hover:bg-[#B36952] transition-colors shadow-sm"
              >
                <Mail size={16} />
                Connect via Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateModal;
