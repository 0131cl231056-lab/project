import React from 'react';
import RoomForm from '../../../components/room/RoomForm';
import RoomCard from '../../../components/room/RoomCard';
import { useRoom } from '../hook/useRoom';
import { useNavigate } from "react-router"

const CreateRoom = () => {
    const navigate = useNavigate()
    const { handleCreateRoom } = useRoom()  

    const previewData = {
      title: "Room Preview",
      rent: 0,
      city: "City",
      state: "State",
      type: "Single",
      available: true,
      amenities: [],
      owner: {
        name: "You"
      }
    }

  const handleSubmit = async (data) => {
   try {

      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("rent", data.rent)
      formData.append("city", data.city)
      formData.append("state", data.state)
      formData.append("address", data.address)
      formData.append("roomType", data.roomType)
      formData.append("available", data.available)

      formData.append(
         "preferredTenant",
         JSON.stringify({
            smoking: data.smoking,
            drinking: data.drinking,
            diet: data.diet,
            gender: data.gender,
            cleanliness: data.cleanliness,
            sleepSchedule: data.sleepSchedule,
         })
      )

      data.images.forEach((img) => {
         formData.append("roomImages", img.file)
      })

      await handleCreateRoom(formData)

      navigate("/owner/my-rooms")

   } catch (err) {
      console.log(err)
   }
}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-rs-primary-text mb-2 tracking-tight">Create a Listing</h1>
        <p className="text-lg text-rs-secondary-text">Share your space with the perfect roommate.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column - Form */}
        <div className="xl:col-span-2">
          <RoomForm onSubmit={handleSubmit} />
        </div>

        {/* Right Column - Live Preview */}
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-rs-secondary-text uppercase tracking-wider mb-4">Live Preview</h3>
            <RoomCard room={previewData} />
            <div className="mt-6 bg-rs-secondary-bg rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-rs-primary-text flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Your listing is looking great!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
