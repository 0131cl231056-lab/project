import { Link } from 'react-router';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';

const Footer = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <footer className="bg-[#FDFAF6] border-t border-[#8B7E74]/15 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="bg-[#C27A62] p-2 rounded-xl text-[#FDFAF6] shadow-sm shadow-[#C27A62]/20 group-hover:bg-[#B36952] transition-colors">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#4A3B32]">
                RoomSync
              </span>
            </Link>
            <p className="text-sm text-[#8B7E74] leading-relaxed max-w-sm">
              Discover rooms and compatible roommates that match your lifestyle, schedule, and preferences. Co-living made peaceful and transparent.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-[#8B7E74]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2E9] text-[#4A3B32]">
                <Sparkles className="w-3.5 h-3.5 text-[#C27A62]" />
                Algorithmic Lifestyle Matching
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2E9] text-[#4A3B32]">
                <Shield className="w-3.5 h-3.5 text-[#C27A62]" />
                Verified Spaces
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#4A3B32] uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8B7E74]">
              <li>
                <Link to="/rooms" className="hover:text-[#C27A62] transition-colors">
                  Browse All Rooms
                </Link>
              </li>
              <li>
                <Link to="/find-roommates" className="hover:text-[#C27A62] transition-colors">
                  Find Roommates
                </Link>
              </li>
              <li>
                <Link to="/rooms?roomType=Single" className="hover:text-[#C27A62] transition-colors">
                  Single Rooms
                </Link>
              </li>
              <li>
                <Link to="/rooms?roomType=Shared" className="hover:text-[#C27A62] transition-colors">
                  Shared Rooms
                </Link>
              </li>
              <li>
                <Link to="/preferences" className="hover:text-[#C27A62] transition-colors">
                  Lifestyle Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-sm font-bold text-[#4A3B32] uppercase tracking-wider mb-4">
              Popular Cities
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8B7E74]">
              <li>
                <Link to="/rooms?city=Bhopal" className="hover:text-[#C27A62] transition-colors">
                  Bhopal
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Indore" className="hover:text-[#C27A62] transition-colors">
                  Indore
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Pune" className="hover:text-[#C27A62] transition-colors">
                  Pune
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Bangalore" className="hover:text-[#C27A62] transition-colors">
                  Bangalore
                </Link>
              </li>
              <li>
                <Link to="/rooms?city=Mumbai" className="hover:text-[#C27A62] transition-colors">
                  Mumbai
                </Link>
              </li>
            </ul>
          </div>

          {/* Owners & Account */}
          <div>
            <h4 className="text-sm font-bold text-[#4A3B32] uppercase tracking-wider mb-4">
              For Owners & Users
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8B7E74]">
              <li>
                <Link to="/create-room" className="hover:text-[#C27A62] transition-colors">
                  List Your Room
                </Link>
              </li>
              {user?.role === 'owner' && (
                <li>
                  <Link to="/owner/my-rooms" className="hover:text-[#C27A62] transition-colors">
                    Manage My Listings
                  </Link>
                </li>
              )}
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className="hover:text-[#C27A62] transition-colors">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/editProfile" className="hover:text-[#C27A62] transition-colors">
                      Edit Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-[#C27A62] transition-colors">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-[#C27A62] transition-colors">
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#8B7E74]/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B7E74]">
          <p>© {new Date().getFullYear()} RoomSync. Designed for comfortable, compatible co-living.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#4A3B32] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#4A3B32] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#4A3B32] cursor-pointer">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
