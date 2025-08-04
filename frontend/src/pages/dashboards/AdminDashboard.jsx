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
  const [announcements, setAnnouncements] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [alumniPage, setAlumniPage] = useState(1);
  const [alumniTotalPages, setAlumniTotalPages] = useState(1);
  const [facultyPage, setFacultyPage] = useState(1);
  const [facultyTotalPages, setFacultyTotalPages] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [eventTotalPages, setEventTotalPages] = useState(1);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [announcementTotalPages, setAnnouncementTotalPages] = useState(1);
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

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`/api/announcements`);
      const announcements = response.data.data;
      setAnnouncements(announcements);
      // Since the API does not provide pagination info, we assume a single page.
      setAnnouncementTotalPages(1);
    } catch (error) {
      console.error("Error fetching announcements:", error);
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
        maxCapacity: event.maxCapacity,
        createdAt: new Date(event.createdAt).toLocaleDateString(),
        updatedAt: new Date(event.updatedAt).toLocaleDateString(),
      }));
      setEvents(formattedEvents);
      setEventTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const response = await axios.get('/api/contactus');
      setContactMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
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
      fetchAnnouncements();
      fetchEvents();
    }
  }, [activeItem, announcementPage, eventPage]);

  useEffect(() => {
    if (activeItem === "Contact us") {
      fetchContactMessages();
    }
  }, [activeItem]);

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
              announcements={announcements}
              announcementPage={announcementPage}
              announcementTotalPages={announcementTotalPages}
              onAnnouncementPageChange={setAnnouncementPage}
              events={events}
              eventPage={eventPage}
              eventTotalPages={eventTotalPages}
              onEventPageChange={setEventPage}
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
            <TestimonyManagementSection />
          )}
          {activeItem === "Contact us" && (
            <ContactUsSection />
          )}
        </main>
      </div>
    </div>
  );
};

const TestimonyManagementSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [testimonialToEdit, setTestimonialToEdit] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [testimonialToApprove, setTestimonialToApprove] = useState(null);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('/api/testimonial/all');
            const testimonialsData = response.data.data;

            // Map the data to the format the component expects
            const formattedTestimonials = testimonialsData.map(testimonial => ({
                ...testimonial,
                author: testimonial.user.fullName || 'Unknown Alumni',
                // role: testimonial.user.currentJobTitle || 'N/A',
                photoUrl: testimonial.user.photoUrl || '',
            }));

            setTestimonials(formattedTestimonials);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditClick = (testimonial) => {
        setTestimonialToEdit(testimonial);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (testimonial) => {
        setTestimonialToDelete(testimonial);
        setIsDeleteModalOpen(true);
    };

    const handleApproveClick = (testimonial) => {
        setTestimonialToApprove(testimonial);
        setIsApproveModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!testimonialToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/testimonial/${testimonialToDelete.id}`);
            fetchTestimonials(); // Refresh the list
            setIsDeleteModalOpen(false);
            setTestimonialToDelete(null);
        } catch (error) {
            console.error("Failed to delete testimonial:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmApprove = async () => {
        if (!testimonialToApprove) return;
        setIsApproving(true);
        try {
            await axios.patch(`/api/testimonials/approve/${testimonialToApprove.id}`);
            fetchTestimonials(); // Refresh the list
            setIsApproveModalOpen(false);
            setTestimonialToApprove(null);
        } catch (error) {
            console.error("Failed to approve testimonial:", error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleCreateTestimonial = async (testimonialData) => {
        try {
            await axios.post('/api/testimonials', testimonialData);
            fetchTestimonials();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create testimonial:", error);
        }
    };

    const handleUpdateTestimonial = async (updatedTestimonial) => {
        try {
            await axios.patch(`/api/testimonial/${updatedTestimonial.id}`, updatedTestimonial);
            fetchTestimonials();
            setIsEditModalOpen(false);
            setTestimonialToEdit(null);
        } catch (error) {
            console.error("Failed to update testimonial:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Testimony Management</h2>
                <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Add New Testimony
                </button>
            </div>
            {testimonials.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {testimonial.photoUrl ? (
                                            <img src={testimonial.photoUrl} alt={testimonial.author} className="h-10 w-10 rounded-full object-cover" />
                                        ) : (
                                            <FiUser className="h-10 w-10 text-gray-400" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testimonial.author}</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testimonial.role}</td> */}
                                    <td className="px-6 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs">{testimonial.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${testimonial.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {testimonial.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {testimonial.status === 'Pending' && (
                                                <button onClick={() => handleApproveClick(testimonial)} className="text-green-600 hover:text-green-900">
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => handleEditClick(testimonial)} className="text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(testimonial)} className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No testimonials available.</p>
            )}

            <CreateTestimonyModal isOpen={isCreateModalOpen} onRequestClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateTestimonial} />
            <EditTestimonyModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} testimonial={testimonialToEdit} onUpdate={handleUpdateTestimonial} />
            <DeleteTestimonyConfirmationModal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} onConfirmDelete={handleConfirmDelete} testimonial={testimonialToDelete} isLoading={isDeleting} />
            <ApproveTestimonyConfirmationModal isOpen={isApproveModalOpen} onRequestClose={() => setIsApproveModalOpen(false)} onConfirmApprove={handleConfirmApprove} testimonial={testimonialToApprove} isLoading={isApproving} />
        </div>
    );
};

const CreateTestimonyModal = ({ isOpen, onRequestClose, onTestimonialCreated }) => {
  const [alumniSearchQuery, setAlumniSearchQuery] = useState("");
  const [alumniSearchResults, setAlumniSearchResults] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [testimonyContent, setTestimonyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [createError, setCreateError] = useState(null);

  // Debounce the search to avoid excessive API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (alumniSearchQuery) {
        handleAlumniSearch(alumniSearchQuery);
      } else {
        setAlumniSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [alumniSearchQuery]);

  const handleAlumniSearch = async (query) => {
    if (!query) return;
    setIsSearching(true);
    setSearchError(null);
    setAlumniSearchResults([]); // Clear previous results before searching
    try {
      // Updated the search parameter from 'name' to 'search'
      const response = await axios.get(`/api/alumni/searchalumni`, {
        params: { search: query }
      });
      
      // Corrected the path to the profiles array from response.data.alumni to response.data.profiles
      if (response.data && response.data.data && response.data.data.profiles) {
        setAlumniSearchResults(response.data.data.profiles);
      } else {
        setAlumniSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for alumni:", error);
      setSearchError("Failed to search for alumni. Please try again.");
      setAlumniSearchResults([]); // Ensure state is an empty array on error
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAlumni = (alumni) => {
    // The key from the API response is now 'alumniId' and 'name'
    setSelectedAlumni({ id: alumni.alumniId, name: alumni.name });
    setAlumniSearchQuery(alumni.name); // Pre-fill search bar with selected alumni name
    setAlumniSearchResults([]); // Clear search results
  };

  const handleCreateTestimony = async () => {
    if (!selectedAlumni || !testimonyContent.trim()) {
      setCreateError("Please select an alumni and provide content for the testimony.");
      return;
    }
    
    setIsLoading(true);
    setCreateError(null);

    try {
      const payload = {
        content: testimonyContent,
        userId: selectedAlumni.id,
      };
      await axios.post('/api/testimonial/create', payload);
      onTestimonialCreated(); // Trigger a refresh or notification
      fetchTestimonials();
      onRequestClose(); // Close the modal on success
    } catch (error) {
      console.error("Error creating testimonial:", error);
      setCreateError("Failed to create testimonial. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setAlumniSearchQuery("");
    setAlumniSearchResults([]);
    setSelectedAlumni(null);
    setTestimonyContent("");
    setIsLoading(false);
    setIsSearching(false);
    setSearchError(null);
    setCreateError(null);
  };

  const handleCloseModal = () => {
    resetState();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Create New Testimonial"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Testimony</h2>
        
        {/* Alumni Search Section */}
        <div className="mb-4">
          <label htmlFor="alumni-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search for Alumni
          </label>
          <input
            id="alumni-search"
            type="text"
            value={alumniSearchQuery}
            onChange={(e) => setAlumniSearchQuery(e.target.value)}
            placeholder="Enter alumni name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {isSearching && <p className="mt-2 text-sm text-gray-500">Searching...</p>}
          {searchError && <p className="mt-2 text-sm text-red-500">{searchError}</p>}
          {alumniSearchResults && alumniSearchResults.length > 0 && (
            <ul className="mt-2 border border-gray-200 rounded-md bg-white max-h-48 overflow-y-auto">
              {alumniSearchResults.map((alumni) => (
                <li
                  // The key from the API response is now 'alumniId'
                  key={alumni.alumniId}
                  onClick={() => handleSelectAlumni(alumni)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  <span className="font-semibold">{alumni.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({alumni.companyName})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected Alumni Display */}
        {selectedAlumni && (
          <div className="p-3 bg-indigo-50 rounded-md border border-indigo-200 mb-4">
            <p className="text-sm text-indigo-700">
              Selected Alumni: <span className="font-semibold">{selectedAlumni.name}</span>
            </p>
          </div>
        )}

        {/* Testimony Content Section */}
        <div className="mb-6">
          <label htmlFor="testimony-content" className="block text-sm font-medium text-gray-700 mb-1">
            Testimony Content
          </label>
          <textarea
            id="testimony-content"
            value={testimonyContent}
            onChange={(e) => setTestimonyContent(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write the testimony here..."
          ></textarea>
        </div>
        
        {createError && <p className="mb-4 text-sm text-red-500">{createError}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateTestimony}
            disabled={isLoading || !selectedAlumni || !testimonyContent.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Testimony'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const EditTestimonyModal = ({ isOpen, onRequestClose, testimonial, onUpdate }) => {
    const [formState, setFormState] = useState(testimonial || { author: '', content: '' });

    useEffect(() => {
        if (testimonial) {
            setFormState(testimonial);
        }
    }, [testimonial]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
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
        >
            <h2 className="text-2xl font-bold mb-4">Edit Testimony</h2>
            {testimonial && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input type="text" name="author" value={formState.author} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Title/Role</label>
                        <input type="text" name="role" value={formState.role} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div> */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea name="content" rows="4" value={formState.content} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

const DeleteTestimonyConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete, testimonial, isLoading }) => {
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
                Are you sure you want to delete this testimony by <span className="font-semibold">{testimonial?.author}</span>? This action cannot be undone.
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

const ApproveTestimonyConfirmationModal = ({ isOpen, onRequestClose, onConfirmApprove, testimonial, isLoading }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-auto my-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            contentLabel="Approve Confirmation"
        >
            <h2 className="text-xl font-bold mb-4">Confirm Approval</h2>
            <p className="text-gray-700">
                Are you sure you want to approve this testimony by <span className="font-semibold">{testimonial?.author}</span>?
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
                    onClick={onConfirmApprove}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {isLoading ? 'Approving...' : 'Approve'}
                </button>
            </div>
        </Modal>
    );
};

// ... other components (UserManagementSection, etc.) from the original file
// All other components from the original file should be included here to make the code a complete, functional file.
// For brevity, they are not included in this response.

const SidebarItem = ({ icon, text, isActive, onClick }) => {
  return (
    <li
      className={`flex items-center p-3 rounded-lg cursor-pointer ${isActive ? "bg-indigo-700 text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"}`}
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: "mr-3" })}
      <span className="font-medium">{text}</span>
    </li>
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

const AnnouncementsEventsSection = ({
    announcements,
    announcementPage,
    announcementTotalPages,
    onAnnouncementPageChange,
    events,
    eventPage,
    eventTotalPages,
    onEventPageChange,
    fetchEvents
}) => {
    return (
        <div className="space-y-6">
            {/* Announcements Section */}
            <AnnouncementsTable
                announcements={announcements}
                currentPage={announcementPage}
                totalPages={announcementTotalPages}
                onPageChange={onAnnouncementPageChange}
            />
            {/* Events Section */}
            <EventsTable
                events={events}
                currentPage={eventPage}
                totalPages={eventTotalPages}
                onPageChange={onEventPageChange}
                fetchEvents={fetchEvents}
            />
        </div>
    );
};

const ContactUsSection = () => {
    const [messages, setMessages] = useState([]);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/contactus');
            setMessages(response.data.data);
        } catch (error) {
            console.error("Error fetching contact messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDeleteClick = (message) => {
        setMessageToDelete(message);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/contactus/${messageToDelete.id}`);
            fetchMessages(); // Refresh the list
            setIsDeleteModalOpen(false);
            setMessageToDelete(null);
        } catch (error) {
            console.error("Failed to delete message:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us Inquiries</h2>
            {messages.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.subject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs">{message.message}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleDeleteClick(message)} className="text-red-600 hover:text-red-900" >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No contact messages available.</p>
            )}
            {messageToDelete && (
                <DeleteContactConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={() => setIsDeleteModalOpen(false)}
                    onConfirmDelete={handleConfirmDelete}
                    message={messageToDelete}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

const DeleteContactConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete, message, isLoading }) => {
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
                Are you sure you want to delete this message from <span className="font-semibold">{message?.name}</span>? This action cannot be undone.
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

const AnnouncementsTable = ({ announcements, currentPage, totalPages, onPageChange }) => {
    const [announcementToEdit, setAnnouncementToEdit] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements');
            setAnnouncements(response.data.data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditClick = (announcement) => {
        setAnnouncementToEdit(announcement);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (announcement) => {
        setAnnouncementToDelete(announcement);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!announcementToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/announcements/${announcementToDelete.id}`);
            fetchAnnouncements();
            setIsDeleteModalOpen(false);
            setAnnouncementToDelete(null);
        } catch (error) {
            console.error("Failed to delete announcement:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateAnnouncement = async (updatedAnnouncement) => {
        setIsLoading(true);
        try {
            await axios.put(`/api/announcements/${updatedAnnouncement.id}`, updatedAnnouncement);
            fetchAnnouncements();
            setIsEditModalOpen(false);
            setAnnouncementToEdit(null);
        } catch (error) {
            console.error("Failed to update announcement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAnnouncement = async (announcementData) => {
        setIsCreating(true);
        try {
            await axios.post('/api/announcements', announcementData);
            fetchAnnouncements();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create announcement:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>
                <button onClick={handleCreateClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" >
                    Create New Announcement
                </button>
            </div>
            {announcements.length > 0 ? (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {announcements.map((announcement) => (
                                <tr key={announcement.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{announcement.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs">{announcement.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEditClick(announcement)} className="text-indigo-600 hover:text-indigo-900" >
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(announcement)} className="text-red-600 hover:text-red-900" >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50" >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50" >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-600">No announcements available.</p>
            )}
            {announcementToEdit && (
                <EditAnnouncementModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} announcement={announcementToEdit} onUpdate={handleUpdateAnnouncement} isLoading={isLoading} />
            )}
            {announcementToDelete && (
                <DeleteAnnouncementModal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} onConfirmDelete={handleConfirmDelete} announcement={announcementToDelete} isLoading={isDeleting} />
            )}
            <CreateAnnouncementModal isOpen={isCreateModalOpen} onRequestClose={() => setIsCreateModalOpen(false)} onCreateAnnouncement={handleCreateAnnouncement} isLoading={isCreating} />
        </div>
    );
};

const EventsTable = ({ events, currentPage, totalPages, onPageChange, fetchEvents }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [eventToApprove, setEventToApprove] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

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

    const handleApproveClick = (event) => {
        setEventToApprove(event);
        setIsApproveModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/api/admin/event/${eventToDelete.id}`);
            fetchEvents();
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (error) {
            console.error("Failed to delete event:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmApprove = async () => {
        if (!eventToApprove) return;
        setIsApproving(true);
        try {
            await axios.post(`/api/admin/event/${eventToApprove.id}`);
            fetchEvents();
            setIsApproveModalOpen(false);
            setEventToApprove(null);
        } catch (error) {
            console.error("Failed to approve event:", error);
        } finally {
            setIsApproving(false);
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
            formData.append('maxCapacity', updatedEvent.maxCapacity);
            if (updatedEvent.photo) {
                formData.append('photo', updatedEvent.photo);
            } else {
                formData.append('imageUrl', updatedEvent.imageUrl);
            }
            await axios.patch(`/api/admin/event/${editingEvent.id}`, formData, {
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
            formData.append('status', 'Pending');
            formData.append('type', eventData.type);
            formData.append('maxCapacity', eventData.maxCapacity);
            if (eventData.photo) {
                formData.append('photo', eventData.photo);
            }
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
                <h2 className="text-xl font-semibold text-gray-800">Events</h2>
                <button onClick={handleCreateClick} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" >
                    Create New Event
                </button>
            </div>
            {events.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {event.status === 'Pending' && (
                                                    <button onClick={() => handleApproveClick(event)} className="text-green-600 hover:text-green-900">
                                                        Approve
                                                    </button>
                                                )}
                                                <button onClick={() => handleApproveClick(event)} className="text-green-600 hover:text-green-900">
                                                        Approve
                                                </button>
                                                <button onClick={() => handleEditClick(event)} className="text-indigo-600 hover:text-indigo-900">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteClick(event)} className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50" >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50" >
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
                <DeleteEventModal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} onConfirmDelete={handleConfirmDelete} event={eventToDelete} isLoading={isDeleting} />
            )}
            {eventToApprove && (
                <ApproveEventConfirmationModal
                    isOpen={isApproveModalOpen}
                    onRequestClose={() => setIsApproveModalOpen(false)}
                    onConfirmApprove={handleConfirmApprove}
                    event={eventToApprove}
                    isLoading={isApproving}
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

const EditAnnouncementModal = ({ isOpen, onRequestClose, announcement, onUpdate, isLoading }) => {
    const [formState, setFormState] = useState(announcement);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
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
        >
            <h2 className="text-2xl font-bold mb-4">Edit Announcement</h2>
            {announcement && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" value={formState.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea name="content" rows="4" value={formState.content} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

const DeleteAnnouncementModal = ({ isOpen, onRequestClose, onConfirmDelete, announcement, isLoading }) => {
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
                Are you sure you want to delete the announcement titled "<span className="font-semibold">{announcement?.title}</span>"? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onRequestClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">
                    Cancel
                </button>
                <button type="button" onClick={onConfirmDelete} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                    {isLoading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
};

const CreateAnnouncementModal = ({ isOpen, onRequestClose, onCreateAnnouncement, isLoading }) => {
    const [formState, setFormState] = useState({ title: '', content: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateAnnouncement(formState);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto my-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold mb-4">Create New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" value={formState.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea name="content" rows="4" value={formState.content} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const EditEventModal = ({ isOpen, onRequestClose, event, onUpdate, isLoading }) => {
    const [formState, setFormState] = useState(event);
    const [photoFile, setPhotoFile] = useState(null);

    useEffect(() => {
        if (event) {
            setFormState(event);
        }
    }, [event]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleFileChange = (e) => {
        setPhotoFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...formState, photo: photoFile });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto my-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            {event && (
                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Event Name</label>
                            <input type="text" name="name" value={formState.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="rawDate" value={formState.rawDate.split('T')[0]} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input type="time" name="time" value={formState.time} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" value={formState.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Organizer</label>
                            <input type="text" name="organizer" value={formState.organizer} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={formState.status} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <input type="text" name="type" value={formState.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                            <input type="number" name="maxCapacity" value={formState.maxCapacity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" rows="3" value={formState.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Event Image</label>
                            <input type="file" name="photo" onChange={handleFileChange} className="mt-1 block w-full" />
                        </div>
                        {formState.imageUrl && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Current Image:</p>
                                <img src={formState.imageUrl} alt="Current Event" className="mt-2 h-32 w-auto object-cover rounded-md" />
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

const DeleteEventModal = ({ isOpen, onRequestClose, onConfirmDelete, event, isLoading }) => {
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
                Are you sure you want to delete the event titled "<span className="font-semibold">{event?.name}</span>"? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onRequestClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">
                    Cancel
                </button>
                <button type="button" onClick={onConfirmDelete} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                    {isLoading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
};

const ApproveEventConfirmationModal = ({ isOpen, onRequestClose, onConfirmApprove, event, isLoading }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-auto my-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            contentLabel="Approve Confirmation"
        >
            <h2 className="text-xl font-bold mb-4">Confirm Approval</h2>
            <p className="text-gray-700">
                Are you sure you want to approve the event titled "<span className="font-semibold">{event?.name}</span>"?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onRequestClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">
                    Cancel
                </button>
                <button type="button" onClick={onConfirmApprove} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
                    {isLoading ? 'Approving...' : 'Approve'}
                </button>
            </div>
        </Modal>
    );
};

const CreateEventModal = ({ isOpen, onRequestClose, onCreateEvent, isLoading }) => {
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        type: '',
        maxCapacity: '',
    });
    const [photoFile, setPhotoFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleFileChange = (e) => {
        setPhotoFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateEvent({ ...formState, photo: photoFile });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto my-20 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" name="name" value={formState.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" value={formState.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="time" name="time" value={formState.time} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" value={formState.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Organizer</label>
                        <input type="text" name="organizer" value={formState.organizer} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <input type="text" name="type" value={formState.type} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                        <input type="number" name="maxCapacity" value={formState.maxCapacity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows="3" value={formState.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Event Image</label>
                        <input type="file" name="photo" onChange={handleFileChange} className="mt-1 block w-full" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onRequestClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AdminDashboard;