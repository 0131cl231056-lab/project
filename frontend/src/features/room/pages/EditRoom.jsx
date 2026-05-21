import React from 'react';
import RoomForm from '../../../components/room/RoomForm';
import RoomCard from '../../../components/room/RoomCard';
import { useParams } from 'react-router';
import { useRoom } from '../hook/useRoom';
import { useSelector } from 'react-redux';
import { useEffect } from "react"

const EditRoom = () => {
  const { roomId } = useParams();
  const { handleGetRoom, handleUpdateRoom } = useRoom()
  const room = useSelector(state => state.room.room)

useEffect(() => {
   handleGetRoom(roomId)
}, [roomId])

  if (!room) {
    return <div>Loading...</div>
  }
  
  const initialData = room || {}

  const handleSubmit = async (data) => {

   const formData = new FormData()

   Object.keys(data).forEach((key) => {
      if (key !== "images") {

          if (typeof data[key] === "object") {
            formData.append(key, JSON.stringify(data[key]))
          } else {
            formData.append(key, data[key])
          }

      }
    })

   data.images.forEach((img) => {
      if (img.file) {
         formData.append("roomImages", img.file)
      }
   })

   await handleUpdateRoom(roomId, formData)
}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-rs-primary-text mb-2 tracking-tight">Edit Listing</h1>
        <p className="text-lg text-rs-secondary-text">Update the details of your room.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Left Column - Form */}
        <div className="xl:col-span-2">
          <RoomForm initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
        </div>

        {/* Right Column - Live Preview */}
        <div className="hidden xl:block">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-rs-secondary-text uppercase tracking-wider mb-4">Live Preview</h3>
            <RoomCard room={{...initialData,_id: roomId,owner: { fullname: 'You' }}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
