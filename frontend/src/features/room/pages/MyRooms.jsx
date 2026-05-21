import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { Edit2, Trash2, Home, Users, CheckCircle, BarChart3 } from 'lucide-react';
import AvailabilityBadge from '../../../components/room/AvailabilityBadge';
import { useRoom } from '../hook/useRoom';
import { useSelector } from 'react-redux';

const MyRooms = () => {

  const { handleGetMyRooms, handleDeleteRoom } = useRoom()

  const myRooms = useSelector(
    state => state.room?.myRooms || []
  )

  useEffect(() => {
    handleGetMyRooms()
  }, [])

  const stats = [
    {
      label: 'Total Rooms',
      value: myRooms.length,
      icon: Home,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'Available',
      value: myRooms.filter(room => room.available).length,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      label: 'Occupied',
      value: myRooms.filter(room => !room.available).length,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      label: 'Total Views',
      value: '1.2k',
      icon: BarChart3,
      color: 'text-rs-accent',
      bg: 'bg-rs-accent/10'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-rs-primary-text mb-1">
            My Dashboard
          </h1>

          <p className="text-rs-secondary-text">
            Manage your room listings and track performance.
          </p>
        </div>

        <Link
          to="/create-room"
          className="bg-rs-accent hover:bg-[#a0634f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Home size={18} />
          Add New Room
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">

        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>

            <div>
              <p className="text-2xl font-bold text-rs-primary-text">
                {stat.value}
              </p>

              <p className="text-sm font-medium text-rs-secondary-text">
                {stat.label}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Listings */}
      <h2 className="text-2xl font-bold text-rs-primary-text mb-6">
        Your Listings
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4">Listing</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rent</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>

              {myRooms.map(room => (

                <tr
                  key={room._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >

                  <td className="p-4">
                    <div className="flex items-center gap-4">

                      <img
                        src={room.roomImages?.[0]}
                        alt={room.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-bold text-rs-primary-text">
                          {room.title}
                        </p>

                        <p className="text-xs text-rs-secondary-text">
                          {room.city}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="p-4">
                    <AvailabilityBadge available={room.available} />
                  </td>

                  <td className="p-4 font-semibold text-rs-primary-text">
                    ₹{room.rent}/mo
                  </td>

                  <td className="p-4">

                    <div className="flex items-center justify-end gap-2">

                      <Link
                        to={`/room/${room._id}`}
                        className="p-2 bg-gray-100 rounded-lg"
                      >
                        <Home size={18} />
                      </Link>

                      <Link
                        to={`/edit-room/${room._id}`}
                        className="p-2 bg-blue-50 text-blue-500 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </Link>

                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default MyRooms;