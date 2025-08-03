import React, { useState, useEffect } from "react";
import { FiHome, FiUsers, FiBell, FiBarChart2, FiBookOpen, FiSettings, FiUser, FiMoreVertical, FiMessageSquare, FiMail } from "react-icons/fi";
import axios from '../../config/axios';
import Modal from 'react-modal';

// Ensure the modal content is accessible to screen readers
Modal.setAppElement('#root');

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Admin Dashboard");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [events, setEvents] = useState([]);

  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [alumniPage, setAlumniPage] = useState(1);
  const [alumniTotalPages, setAlumniTotalPages] = useState(1);
  const [facultyPage, setFacultyPage] = useState(1);
  const [facultyTotalPages, setFacultyTotalPages] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);
  const limit = 10;

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`/api/student/getall?page=${studentPage}&limit=${limit}`);
      const { students: fetchedStudents, pagination } = response.data.data;
      const formattedStudents = fetchedStudents.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        status: user.isVerified ? 'Approved' : 'Pending',
        photoUrl: user.photoUrl,
      }));
      setStudents(formattedStudents);
      setStudentTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(`/api/alumni/getall?page=${alumniPage}&limit=${limit}`);
      const { alumni: fetchedAlumni, pagination } = response.data.data;
      const formattedAlumni = fetchedAlumni.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        status: user.isVerified ? 'Approved' : 'Pending',
        photoUrl: user.photoUrl,
        phoneNumber: user.phoneNumber || '',
        department: user.department || '',
        bio: user.bio || '',
        linkedinUrl: user.linkedinUrl || '',
        twitterUrl: user.twitterUrl || '',
        githubUrl: user.githubUrl || '',
        companyRole: user.companyRole || '',
        graduationYear: user.graduationYear || '',
        course: user.course || '',
        currentJobTitle: user.currentJobTitle || '',
        companyName: user.companyName || '',
      }));
      setAlumni(formattedAlumni);
      setAlumniTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`/api/faculty/getall?page=${facultyPage}&limit=${limit}`);
      const { faculty: fetchedFaculty, pagination } = response.data.data;
      const formattedFaculty = fetchedFaculty.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        status: user.isVerified ? 'Approved' : 'Pending',
        photoUrl: user.photoUrl,
      }));
      setFaculty(formattedFaculty);
      setFacultyTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/api/admin/event/all?page=${eventPage}&limit=${limit}`);
      const { events: fetchedEvents, pagination } = response.data.data;
      const formattedEvents = fetchedEvents.map(event => ({
        id: event.id,
        name: event.name,
        date: new Date(event.date).toLocaleDateString(),
        rawDate: event.date,
        time: event.time,
        location: event.location,
        organizer: event.organizer,
        status: event.status,
        type: event.type,
        description: event.description,
        imageUrl: event.imageUrl,
      }));
      setEvents(formattedEvents);
      setEventTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleApproveUser = async (user, userType) => {
    try {
      await axios.post(`/api/admin/verify/${userType}/${user.id}`);
      if (userType === 'student') fetchStudents();
      if (userType === 'alumni') fetchAlumni();
      if (userType === 'faculty') fetchFaculty();
    } catch (error) {
      console.error(`Error approving ${userType} user:`, error);
    }
  };

  const handleRejectUser = async (user, userType) => {
    try {
      await axios.post(`/api/admin/reject/${userType}/${user.id}`);
      if (userType === 'student') fetchStudents();
      if (userType === 'alumni') fetchAlumni();
      if (userType === 'faculty') fetchFaculty();
    } catch (error) {
      console.error(`Error rejecting ${userType} user:`, error);
    }
  };

  const handleDeleteUser = async (user, userType) => {
    try {
      // The user-specified endpoint for alumni is /alumni/:id
      // We will assume similar endpoints for students and faculty for a consistent UI
      await axios.delete(`/api/${userType}/${user.id}`);
      if (userType === 'student') fetchStudents();
      if (userType === 'alumni') fetchAlumni();
      if (userType === 'faculty') fetchFaculty();
    } catch (error) {
      console.error(`Error deleting ${userType} user:`, error);
    }
  };

  const handleUpdateAlumni = async (updatedData) => {
    try {
      // API call to update alumni data
      await axios.patch(`/api/admin/alumni/${updatedData.id}`, updatedData);
      fetchAlumni(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error("Error updating alumni:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (activeItem === "Student Management") {
      fetchStudents();
    }
  }, [activeItem, studentPage]);

  useEffect(() => {
    if (activeItem === "Alumni Management") {
      fetchAlumni();
    }
  }, [activeItem, alumniPage]);

  useEffect(() => {
    if (activeItem === "Faculty Management") {
      fetchFaculty();
    }
  }, [activeItem, facultyPage]);

  useEffect(() => {
    if (activeItem === "Announcements & Events") {
      fetchEvents();
    }
  }, [activeItem, eventPage]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-semibold text-gray-800 border-b">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem
            icon={<FiHome />}
            text="Admin Dashboard"
            isActive={activeItem === "Admin Dashboard"}
            onClick={() => setActiveItem("Admin Dashboard")}
          />
          <li
            key="User Verification"
            className="relative"
          >
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-indigo-700 hover:text-white ${activeItem.startsWith("User Management") ? "bg-indigo-700 text-white" : "text-gray-300"}`}
              onClick={() => setOpenDropdown(prev => !prev)}
            >
              <FiUsers className="mr-3" />
              User Management
              <svg
                className={`w-4 h-4 ml-auto transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {openDropdown && (
              <ul className="pl-8 mt-2 space-y-2">
                <li
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white ${activeItem === "Student Management" ? "bg-indigo-600 text-white" : "text-gray-300"}`}
                  onClick={() => setActiveItem("Student Management")}
                >
                  Student Management
                </li>
                <li
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white ${activeItem === "Alumni Management" ? "bg-indigo-600 text-white" : "text-gray-300"}`}
                  onClick={() => setActiveItem("Alumni Management")}
                >
                  Alumni Management
                </li>
                <li
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-indigo-600 hover:text-white ${activeItem === "Faculty Management" ? "bg-indigo-600 text-white" : "text-gray-300"}`}
                  onClick={() => setActiveItem("Faculty Management")}
                >
                  Faculty Management
                </li>
              </ul>
            )}
          </li>
          <SidebarItem
            icon={<FiBell />}
            text="Announcements & Events"
            isActive={activeItem === "Announcements & Events"}
            onClick={() => setActiveItem("Announcements & Events")}
          />
          <SidebarItem
            icon={<FiBarChart2 />}
            text="Engagement Reports"
            isActive={activeItem === "Engagement Reports"}
            onClick={() => setActiveItem("Engagement Reports")}
          />
          <SidebarItem
            icon={<FiBookOpen />}
            text="Content Moderation"
            isActive={activeItem === "Content Moderation"}
            onClick={() => setActiveItem("Content Moderation")}
          />
          <SidebarItem
            icon={<FiMessageSquare />}
            text="Testimony"
            isActive={activeItem === "Testimony"}
            onClick={() => setActiveItem("Testimony")}
          />
          <SidebarItem
            icon={<FiMail />}
            text="Contact us"
            isActive={activeItem === "Contact us"}
            onClick={() => setActiveItem("Contact us")}
          />
        </nav>
        <div className="p-4 border-t">
          <div className="text-lg font-semibold text-gray-800 mb-2">Settings</div>
          <p className="text-sm text-gray-500">This is the settings page. You</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex justify-between items-center p-6 bg-white shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <FiBell className="text-gray-600 text-xl" />
            <div className="flex items-center space-x-2">
              <FiUser className="text-gray-600 text-xl" />
              <span className="text-gray-800 font-medium">Admin User</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {activeItem === "Admin Dashboard" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Admin Dashboard!</h2>
              <p className="text-gray-600">Select an option from the sidebar to get started.</p>
            </div>
          )}
          {activeItem === "Student Management" && (
            <UserManagementSection
              title="Student Management"
              users={students}
              userType="student"
              currentPage={studentPage}
              totalPages={studentTotalPages}
              onPageChange={setStudentPage}
              onApprove={(user) => handleApproveUser(user, 'student')}
              onReject={(user) => handleRejectUser(user, 'student')}
              onDelete={(user) => handleDeleteUser(user, 'student')}
              onUpdateAlumni={handleUpdateAlumni}
            />
          )}
          {activeItem === "Alumni Management" && (
            <UserManagementSection
              title="Alumni Management"
              users={alumni}
              userType="alumni"
              currentPage={alumniPage}
              totalPages={alumniTotalPages}
              onPageChange={setAlumniPage}
              onApprove={(user) => handleApproveUser(user, 'alumni')}
              onReject={(user) => handleRejectUser(user, 'alumni')}
              onDelete={(user) => handleDeleteUser(user, 'alumni')}
              onUpdateAlumni={handleUpdateAlumni}
            />
          )}
          {activeItem === "Faculty Management" && (
            <UserManagementSection
              title="Faculty Management"
              users={faculty}
              userType="faculty"
              currentPage={facultyPage}
              totalPages={facultyTotalPages}
              onPageChange={setFacultyPage}
              onApprove={(user) => handleApproveUser(user, 'faculty')}
              onReject={(user) => handleRejectUser(user, 'faculty')}
              onDelete={(user) => handleDeleteUser(user, 'faculty')}
              onUpdateAlumni={handleUpdateAlumni}
            />
          )}
          {activeItem === "Announcements & Events" && (
            <AnnouncementsEventsSection
              events={events}
              currentPage={eventPage}
              totalPages={eventTotalPages}
              onPageChange={setEventPage}
              fetchEvents={fetchEvents}
            />
          )}
          {activeItem === "Content Moderation" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Content Moderation</h2>
              <p className="text-gray-600">This section is for moderating content.</p>
            </div>
          )}
          {activeItem === "Testimony" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Testimony Management</h2>
              <p className="text-gray-600">This section will handle alumni testimonials.</p>
            </div>
          )}
          {activeItem === "Contact us" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us Inquiries</h2>
              <p className="text-gray-600">This section will display messages from the 'Contact Us' form.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const UserManagementSection = ({ title, users, userType, currentPage, totalPages, onPageChange, onApprove, onReject, onDelete, onUpdateAlumni }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModal(true);
    setOpenDropdownId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      await onDelete(selectedUser);
      setIsDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updatedUserData) => {
    if (userType === 'alumni') {
      const response = await onUpdateAlumni(updatedUserData);
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedUser(null);
      }
    } else {
      // Placeholder for other user types.
      console.log("Updating user:", updatedUserData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {users.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <FiUser className="h-10 w-10 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onApprove(user)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onReject(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <div className="relative inline-block text-left">
                        <div>
                          <button
                            type="button"
                            className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                          >
                            <FiMoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                        {openDropdownId === user.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No {title.toLowerCase()} data available.</p>
      )}
      {selectedUser && userType === 'alumni' && (
        <EditAlumniModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          alumni={selectedUser}
          onUpdate={handleUpdate}
        />
      )}
      {selectedUser && userType !== 'alumni' && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onUpdate={handleUpdate}
        />
      )}
      {selectedUser && (
        <DeleteUserConfirmationModal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModal(false)}
          onConfirmDelete={handleConfirmDelete}
          user={selectedUser}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

const EditUserModal = ({ isOpen, onRequestClose, user, onUpdate }) => {
  // This is a placeholder modal for students and faculty
  const [userData, setUserData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(userData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      contentLabel="Edit User"
    >
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

const EditAlumniModal = ({ isOpen, onRequestClose, alumni, onUpdate }) => {
  const [formState, setFormState] = useState(alumni);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { success } = await onUpdate(formState);
    if (success) {
      onRequestClose();
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      contentLabel="Edit Alumni Profile"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Alumni Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" value={formState.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formState.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" name="phoneNumber" value={formState.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input type="text" name="department" value={formState.department} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input type="text" name="graduationYear" value={formState.graduationYear} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <input type="text" name="course" value={formState.course} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" name="companyName" value={formState.companyName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Job Title</label>
            <input type="text" name="currentJobTitle" value={formState.currentJobTitle} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input type="url" name="linkedinUrl" value={formState.linkedinUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
            <input type="url" name="twitterUrl" value={formState.twitterUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
            <input type="url" name="githubUrl" value={formState.githubUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea name="bio" rows="3" value={formState.bio} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onRequestClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteUserConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete, user, isLoading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      contentLabel="Delete Confirmation"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p className="text-gray-700">
        Are you sure you want to delete the user <span className="font-semibold">{user?.name}</span>? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onRequestClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirmDelete}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

const AnnouncementsEventsSection = ({ events, currentPage, totalPages, onPageChange, fetchEvents }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/event/delete/${eventToDelete.id}`);
      fetchEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateEvent = async (updatedEvent) => {
    setIsLoading(true);
    try {
      // Create a FormData object to handle file and other data
      const formData = new FormData();
      formData.append('name', updatedEvent.name);
      formData.append('description', updatedEvent.description);
      formData.append('date', updatedEvent.rawDate);
      formData.append('time', updatedEvent.time);
      formData.append('location', updatedEvent.location);
      formData.append('organizer', updatedEvent.organizer);
      formData.append('status', updatedEvent.status);
      formData.append('type', updatedEvent.type);
      if (updatedEvent.photo) {
        formData.append('photo', updatedEvent.photo);
      } else {
        formData.append('imageUrl', updatedEvent.imageUrl);
      }

      await axios.put(`/api/admin/event/update/${editingEvent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchEvents(); // Refresh the event list
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    setIsCreating(true);
    try {
      // Create a FormData object to handle file and other data
      const formData = new FormData();
      formData.append('name', eventData.name);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('time', eventData.time);
      formData.append('location', eventData.location);
      formData.append('organizer', eventData.organizer);
      formData.append('type', eventData.type);
      formData.append('photo', eventData.photo); // The API expects 'photo' for file upload

      await axios.post('/api/admin/event/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchEvents();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Announcements & Events</h2>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Event
        </button>
      </div>
      {events.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${event.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No events available.</p>
      )}
      {editingEvent && (
        <EditEventModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          event={editingEvent}
          onUpdate={handleUpdateEvent}
          isLoading={isLoading}
        />
      )}
      {eventToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleConfirmDelete}
          event={eventToDelete}
          isLoading={isDeleting}
        />
      )}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        isLoading={isCreating}
      />
    </div>
  );
};
export default AdminDashboard;


// This component is required to handle the specific fields requested for alumni
const EditEventModal = ({ isOpen, onRequestClose, event, onUpdate, isLoading }) => {
  const [formState, setFormState] = useState(event);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formState);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      contentLabel="Edit Event"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Image</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
          <p className="text-sm text-gray-500 mt-1">Leave blank to keep the existing image.</p>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="rawDate" value={formState.rawDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" name="time" value={formState.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input type="text" name="type" value={formState.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formState.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" value={formState.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organizer</label>
          <input type="text" name="organizer" value={formState.organizer} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
const DeleteConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete, event, isLoading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      contentLabel="Delete Confirmation"
    >
      <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p className="text-gray-700">
        Are you sure you want to delete the event <span className="font-semibold">{event?.name}</span>? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onRequestClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirmDelete}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

const CreateEventModal = ({ isOpen, onRequestClose, onCreateEvent, isLoading }) => {
  const [formState, setFormState] = useState({ name: '', date: '', time: '', type: '', description: '', location: '', organizer: '', photo: null, });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: files ? files[0] : value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEvent(formState);
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto my-20 relative" overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" contentLabel="Create New Event" >
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Image</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" required />
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" value={formState.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" name="time" value={formState.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input type="text" name="type" value={formState.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formState.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" value={formState.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organizer</label>
          <input type="text" name="organizer" value={formState.organizer} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" >
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
const SidebarItem = ({ icon, text, isActive, onClick }) => (
  <button className={`flex items-center w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200 ${isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : ""}`} onClick={onClick} >
    <span className="mr-3 text-xl">{icon}</span>
    <span>{text}</span>
  </button>
);
