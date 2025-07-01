import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import EditEvent from "./EditEvent";
import { toast } from "react-toastify";

const statusBadge = (status) => {
  // Normalize backend status to UI
  let display = "Pending", color = "bg-yellow-200 text-yellow-800";
  if (status === "approved" || status === "Approved") {
    display = "Approved";
    color = "bg-green-200 text-green-800";
  } else if (status === "rejected" || status === "Rejected") {
    display = "Rejected";
    color = "bg-red-200 text-red-800";
  } else if (status === "pending" || status === "Pending") {
    display = "Pending";
    color = "bg-yellow-200 text-yellow-800";
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{display}</span>
  );
};

const formatDateTime = (date, time) => {
  const d = new Date(`${date}T${time}`);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) +
    " | " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatCreatedAt = (createdAt) => {
  const d = new Date(createdAt);
  return d.toLocaleString();
};

const getApiUrl = (section, page = 1, limit = 5) => {
  // Always use the admin endpoint for all roles
  return `/api/admin/event/all?page=${page}&limit=${limit}`;
};

const AlumniEventSubmissions = ({ sectionDefault = "alumni" }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalEvents: 0, hasNextPage: false, hasPreviousPage: false });
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // Track which event's action menu is open
  const navigate = useNavigate();
  const limit = 5;

  // Fetch events from backend
  const fetchEvents = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl(sectionDefault, page, limit), {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      // Extract and filter events by role
      let eventsArr = [];
      if (data && data.data && Array.isArray(data.data.events)) {
        eventsArr = data.data.events.filter(event => event.createdBy?.role === sectionDefault);
      } else if (Array.isArray(data.events)) {
        eventsArr = data.events.filter(event => event.createdBy?.role === sectionDefault);
      } else if (Array.isArray(data.data)) {
        eventsArr = data.data.filter(event => event.createdBy?.role === sectionDefault);
      } else if (Array.isArray(data.results)) {
        eventsArr = data.results.filter(event => event.createdBy?.role === sectionDefault);
      } else if (Array.isArray(data)) {
        eventsArr = data.filter(event => event.createdBy?.role === sectionDefault);
      }
      setEvents(eventsArr);
      // Extract pagination info if available
      if (data.pagination) {
        setPagination(data.pagination);
      } else if (data.data && data.data.pagination) {
        setPagination(data.data.pagination);
      } else {
        setPagination({ currentPage: page, totalPages: 1, totalEvents: eventsArr.length, hasNextPage: false, hasPreviousPage: false });
      }
    } catch (err) {
      setError(err.message);
      setEvents([]);
      setPagination({ currentPage: 1, totalPages: 1, totalEvents: 0, hasNextPage: false, hasPreviousPage: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
    // eslint-disable-next-line
  }, [sectionDefault, currentPage]);

  // Update event status in backend
  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) throw new Error("Event not found");

      // Reconstruct the minimal expected backend format
      const updatedEvent = {
        name: event.name,
        date: event.date,
        time: event.time,
        type: event.type,
        description: event.description || "",
        location: event.location,
        organizer: event.organizer,
        imageUrl: event.imageUrl || "",
        maxCapacity: event.maxCapacity || 100, // fallback default
        status: newStatus,
      };

      const url = `/api/admin/event/${eventId}`;
      console.log("[PATCH Event] URL:", url);
      console.log("[PATCH Event] Payload:", updatedEvent);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      console.log("[PATCH Event] Status:", res.status);
      let responseText = await res.text();
      try { responseText = JSON.parse(responseText); } catch { /* keep as text */ }
      console.log("[PATCH Event] Response:", responseText);

      if (!res.ok) {
        throw new Error("Failed to update status: " + (responseText.message || responseText || res.status));
      }

      // Refresh list
      await fetchEvents(currentPage);

    } catch (err) {
      alert("Error updating status: " + err.message);
      console.error("Status update error:", err);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);
    setError(null);
    try {
      // Use admin endpoint for deletion
      const res = await fetch(`/api/admin/event/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete event");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete event.");
      setError(err.message || "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading events...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {sectionDefault === "alumni" && "Alumni Events"}
        {sectionDefault === "faculty" && "Faculty Events"}
        {sectionDefault === "admin" && "Admin Events"}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Event ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Date & Time</th>
              <th className="p-2">Type</th>
              <th className="p-2">Location</th>
              <th className="p-2">Organizer</th>
              <th className="p-2">Created By</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="p-2">{event.id}</td>
                  <td className="p-2">{event.name}</td>
                  <td className="p-2">{formatDateTime(event.date, event.time)}</td>
                  <td className="p-2">{event.type}</td>
                  <td className="p-2">{event.location}</td>
                  <td className="p-2">{event.organizer}</td>
                  <td className="p-2">
                    <div>{event.createdBy?.name}</div>
                    <div className="text-xs text-gray-500">{event.createdBy?.email}</div>
                    <div className="text-xs italic">{event.createdBy?.role}</div>
                  </td>
                  <td className="p-2">{formatCreatedAt(event.createdAt)}</td>
                  <td className="p-2">{statusBadge(event.status)}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      disabled={event.status === "approved"}
                      onClick={() => handleStatusChange(event.id, "approved")}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      disabled={event.status === "rejected"}
                      onClick={() => handleStatusChange(event.id, "rejected")}
                    >
                      ❌ Reject
                    </button>
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === event.id ? null : event.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Actions
                      </button>
                      {actionMenuOpen === event.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setActionMenuOpen(null);
                              // Use existing edit logic
                              navigate(`/events/edit/${event.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              setActionMenuOpen(null);
                              handleDeleteEvent(event.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <button
            className={`px-3 py-1 rounded bg-gray-200 mr-2 ${!pagination.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </button>
          <button
            className={`px-3 py-1 rounded bg-gray-200 ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages} &nbsp;|&nbsp; Showing {events.length} of {pagination.totalEvents} events
        </div>
      </div>
      {/* Add a route for editing event */}
      <Routes>
        <Route path="/admin/events/edit/:id" element={<EditEvent />} />
      </Routes>
    </div>
  );
};

export default AlumniEventSubmissions;
