import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const eventTypes = ["Seminar", "Workshop", "Meetup"];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === Number(id));

  if (!event) {
    return <div className="text-center text-red-600 mt-6">Event not found.</div>;
  }

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

  const [errors, setErrors] = useState({}); // ✅ Added for inline error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEventForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // ✅ Display errors under fields
      toast.error("Please fix validation errors.");
      return;
    }

    toast.success("Event updated! (Mock)");
    navigate(-1);
  };

  const validateEventForm = ({ name, date, time, description, imageUrl }) => {
    const errors = {};

    if (!name || name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    }
    if (!date) {
      errors.date = 'Date is required.';
    }
    if (!time) {
      errors.time = 'Time is required.';
    }
    if (!description || description.trim() === '') {
      errors.description = 'Description cannot be empty.';
    }
    if (imageUrl && !/^https?:\/\/.+\..+/.test(imageUrl)) {
      errors.imageUrl = 'Image URL must be valid.';
    }

    return errors;
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" />
            {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border p-2 rounded" />
            {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time}</p>}
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
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
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
          {errors.imageUrl && <p className="text-sm text-red-600 mt-1">{errors.imageUrl}</p>}
        </div>
        <button type="submit" className="rounded-full px-4 py-1.5 font-semibold bg-blue-600 text-white shadow hover:bg-blue-700 transition">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEvent;