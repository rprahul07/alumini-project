import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const eventTypes = ["Seminar", "Workshop", "Meetup"];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === Number(id));
  const [form, setForm] = useState({
    name: event?.name || "",
    date: event?.date || "",
    time: event?.time || "",
    type: event?.type || "Seminar",
    description: event?.description || "",
    location: event?.location || "",
    organizer: event?.organizer || "",
    imageUrl: event?.imageUrl || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send PUT request to backend
    toast.success("Event updated! (Mock)");
    navigate(-1);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
        </div>
        <div>
          <label className="block font-semibold">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
        </div>
        <div>
          <label className="block font-semibold">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Organizer</label>
          <input type="text" name="organizer" value={form.organizer} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Image URL</label>
          <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="rounded-full px-4 py-1.5 font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEvent;