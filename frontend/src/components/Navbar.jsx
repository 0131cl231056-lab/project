import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  User,
  LogOut,
  ChevronDown,
  HeartHandshake,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { BedDouble } from "lucide-react";
import { useAuth } from "../features/auth/hook/useAuth";

const Navbar = () => {
  const auth = useSelector(state => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const profile = auth?.user || {};
  const isAuthenticated = !!auth?.user;

  const fullname = profile?.fullname || "User";
  const email = profile?.email || "No email";
  const profilePicture = profile?.profilePicture;

  const initials =
    fullname
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "U";

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const { handleLogout: logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isOwner = profile?.role === "owner";

  const ownerLinks = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-4 h-4 mr-2" />,
    },
    {
      name: "Dashboard",
      path: "/owner/dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    // {
    //   name: "My Rooms",
    //   path: "/owner/my-rooms",
    //   icon: <BedDouble className="w-4 h-4 mr-2" />,
    // },
    {
      name: "Create Room",
      path: "/create-room",
      icon: <PlusCircle className="w-4 h-4 mr-2" />,
    },
    {
      name: "Browse Rooms",
      path: "/rooms",
      icon: <BedDouble className="w-4 h-4 mr-2" />,
    },
  ];

  const userLinks = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-4 h-4 mr-2" />,
    },
    {
      name: "Browse Rooms",
      path: "/rooms",
      icon: <BedDouble className="w-4 h-4 mr-2" />,
    },
    {
      name: "Find Roommates",
      path: "/find-roommates",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    ...(isAuthenticated
      ? [
          {
            name: "Edit Preferences",
            path: "/preferences",
            icon: <Settings className="w-4 h-4 mr-2" />,
          },
        ]
      : [
          {
            name: "Preferences",
            path: "/preferences",
            icon: <Settings className="w-4 h-4 mr-2" />,
          },
        ]),
  ];

  const navLinks = isOwner ? ownerLinks : userLinks;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-[#FDFAF6]/90 backdrop-blur-md shadow-sm shadow-[#4A3B32]/5 py-1"
          : "bg-[#F5F2E9] py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="bg-[#C27A62] p-2 rounded-xl text-[#FDFAF6] shadow-sm shadow-[#C27A62]/20 group-hover:bg-[#B36952] transition-colors duration-300 transform group-hover:scale-105">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <span className="font-bold text-xl sm:text-2xl tracking-tight text-[#4A3B32]">
                RoomSync
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                    isActive
                      ? "bg-[#C27A62] text-[#FDFAF6] shadow-md shadow-[#C27A62]/20"
                      : "text-[#8B7E74] hover:bg-[#FDFAF6] hover:text-[#4A3B32]"
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button */}
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 bg-[#FDFAF6] border border-[#8B7E74]/20 p-1.5 pr-3 rounded-full hover:bg-[#F5F2E9] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C27A62]/50 shadow-sm"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#C27A62] flex items-center justify-center text-[#FDFAF6] font-semibold text-sm shadow-inner overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Name + Icon */}
                  <div className="flex items-center text-sm font-medium text-[#4A3B32]">
                    <span className="hidden lg:block mr-2">
                      {fullname}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-[#8B7E74] transition-transform duration-300 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-xl shadow-[#4A3B32]/10 bg-[#FDFAF6] ring-1 ring-[#4A3B32]/5 origin-top-right transition-all duration-300 ease-out ${
                    isProfileDropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="p-2">
                    {/* User Info */}
                    <div className="px-3 py-3 border-b border-[#8B7E74]/15 mb-2">
                      <p className="text-sm font-semibold text-[#4A3B32]">
                        {fullname}
                      </p>

                      <p className="text-xs text-[#8B7E74] truncate mt-0.5">
                        {email}
                      </p>
                    </div>

                    {/* Profile */}
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-colors duration-200 ${
                          isActive
                            ? "bg-[#F5F2E9] text-[#C27A62] font-medium"
                            : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                        }`
                      }
                    >
                      <User className="w-4 h-4 mr-3 text-[#8B7E74]" />
                      Profile
                    </NavLink>

                    {/* Edit Profile */}
                    <NavLink
                      to="/editProfile"
                      className={({ isActive }) =>
                        `flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-colors duration-200 ${
                          isActive
                            ? "bg-[#F5F2E9] text-[#C27A62] font-medium"
                            : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                        }`
                      }
                    >
                      <Settings className="w-4 h-4 mr-3 text-[#8B7E74]" />
                      Edit Profile
                    </NavLink>

                    {profile?.role === "owner" && (
                      <>
                        <NavLink
                          to="/owner/dashboard"
                          className={({ isActive }) =>
                            `flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-colors duration-200 ${
                              isActive
                                ? "bg-[#F5F2E9] text-[#C27A62] font-medium"
                                : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                            }`
                          }
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3 text-[#8B7E74]" />
                          Dashboard
                        </NavLink>

                        <NavLink
                          to="/owner/my-rooms"
                          className={({ isActive }) =>
                            `flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-colors duration-200 ${
                              isActive
                                ? "bg-[#F5F2E9] text-[#C27A62] font-medium"
                                : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                            }`
                          }
                        >
                          <BedDouble className="w-4 h-4 mr-3 text-[#8B7E74]" />
                          My Rooms
                        </NavLink>

                        <NavLink
                          to="/create-room"
                          className={({ isActive }) =>
                            `flex items-center w-full px-3 py-2.5 text-sm rounded-xl transition-colors duration-200 ${
                              isActive
                                ? "bg-[#F5F2E9] text-[#C27A62] font-medium"
                                : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                            }`
                          }
                        >
                          <PlusCircle className="w-4 h-4 mr-3 text-[#8B7E74]" />
                          Create Room
                        </NavLink>
                      </>
                    )}

                    <div className="h-px bg-[#8B7E74]/15 my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2.5 text-sm rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-400" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-full bg-[#C27A62] text-[#FDFAF6] font-medium hover:bg-[#B36952] transition-all duration-300 shadow-md shadow-[#C27A62]/20"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#8B7E74] hover:text-[#4A3B32] hover:bg-[#FDFAF6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C27A62] transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="block w-6 h-6" />
              ) : (
                <Menu className="block w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute inset-x-0 top-full bg-[#FDFAF6] shadow-xl shadow-[#4A3B32]/10 border-t border-[#8B7E74]/10 transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-[#F5F2E9] text-[#C27A62]"
                    : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                }`
              }
            >
              {React.cloneElement(link.icon, {
                className: "w-5 h-5 mr-3",
              })}
              {link.name}
            </NavLink>
          ))}

          <div className="border-t border-[#8B7E74]/15 my-4 pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#C27A62] flex items-center justify-center text-[#FDFAF6] font-semibold text-base shadow-sm overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="ml-3">
                    <p className="text-base font-semibold text-[#4A3B32]">
                      {fullname}
                    </p>

                    <p className="text-sm text-[#8B7E74]">
                      {email}
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-[#F5F2E9] text-[#C27A62]"
                        : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                    }`
                  }
                >
                  <User className="w-5 h-5 mr-3 text-[#8B7E74]" />
                  Profile
                </NavLink>

                <NavLink
                  to="/editProfile"
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-[#F5F2E9] text-[#C27A62]"
                        : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                    }`
                  }
                >
                  <Settings className="w-5 h-5 mr-3 text-[#8B7E74]" />
                  Edit Profile
                </NavLink>

                {profile?.role === "owner" && (
                  <>
                    <NavLink
                      to="/owner/dashboard"
                      className={({ isActive }) =>
                        `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[#F5F2E9] text-[#C27A62]"
                            : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                        }`
                      }
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3 text-[#8B7E74]" />
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/owner/my-rooms"
                      className={({ isActive }) =>
                        `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[#F5F2E9] text-[#C27A62]"
                            : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                        }`
                      }
                    >
                      <BedDouble className="w-5 h-5 mr-3 text-[#8B7E74]" />
                      My Rooms
                    </NavLink>

                    <NavLink
                      to="/create-room"
                      className={({ isActive }) =>
                        `flex items-center w-full px-4 py-3 rounded-2xl text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[#F5F2E9] text-[#C27A62]"
                            : "text-[#4A3B32] hover:bg-[#F5F2E9]"
                        }`
                      }
                    >
                      <PlusCircle className="w-5 h-5 mr-3 text-[#8B7E74]" />
                      Create Room
                    </NavLink>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 mt-2 rounded-2xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3 text-red-400" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-3 rounded-2xl text-base font-medium bg-[#C27A62] text-[#FDFAF6] hover:bg-[#B36952] transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;