import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testimonialsAPI } from '../services/testimonialsService';
import { dashboardAPI } from '../services/dashboardService';
import Navbar from '../components/Navbar';
import TestimonialSearch from '../components/TestimonialSearch';
import TestimonialFilterButton from '../components/TestimonialFilterButton';
import TestimonialActiveFilters from '../components/TestimonialActiveFilters';
import { StarIcon } from '@heroicons/react/24/solid';
import { AcademicCapIcon, CalendarDaysIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const TestimonialsPage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const testimonialsPerPage = 8;

  useEffect(() => {
    fetchTestimonials();
    fetchDashboardStats();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const result = await testimonialsAPI.getPublic();
      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const result = await dashboardAPI.getStats();
      if (result.success) {
        setDashboardStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  // Handle search
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'department') {
      setFilterDepartment(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle sort changes
  const handleSortChange = (sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle clear filter
  const handleClearFilter = (filterType) => {
    if (filterType === 'department') {
      setFilterDepartment('');
    }
    setCurrentPage(1);
  };

  // Filter and sort testimonials
  const filteredAndSortedTestimonials = testimonials
    .filter(testimonial => {
      const matchesSearch = 
        testimonial.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.user?.alumni?.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.user?.alumni?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = 
        !filterDepartment || testimonial.user?.department === filterDepartment;

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.user?.fullName || '').localeCompare(b.user?.fullName || '');
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Get unique departments for filter
  const departments = [...new Set(testimonials.map(t => t.user?.department).filter(Boolean))];

  // Pagination
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredAndSortedTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(filteredAndSortedTestimonials.length / testimonialsPerPage);

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  const getUserInitials = (user) => {
    if (!user?.fullName) return 'A';
    return user.fullName.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-medium mb-6">
                <StarIcon className="h-4 w-4 mr-2" />
                Success Stories from Our Alumni
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Alumni{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Testimonials
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Discover inspiring journeys and achievements from our accomplished alumni who are making their mark across various industries worldwide.
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    {testimonials.length}+
                  </div>
                  <div className="text-gray-600 font-medium">Success Stories</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    {departments.length}+
                  </div>
                  <div className="text-gray-600 font-medium">Departments</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    {dashboardAPI.formatNumber(dashboardStats.totalAlumni || 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Alumni Network</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <TestimonialSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              isLoading={loading}
            />
            <TestimonialFilterButton
              filterDepartment={filterDepartment}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              departments={departments}
            />
          </div>

          {/* Active Filters */}
          <TestimonialActiveFilters
            searchTerm={searchTerm}
            filterDepartment={filterDepartment}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />

          {/* Results count */}
          <div className="mb-4 flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Showing {filteredAndSortedTestimonials.length} testimonial{filteredAndSortedTestimonials.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {filterDepartment && ` from ${filterDepartment}`}
          </div>
          {/* Testimonials Content */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <StarIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>
            ) : filteredAndSortedTestimonials.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <StarIcon className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No testimonials found</h3>
                <p className="text-gray-500 text-lg mb-8">
                  {searchTerm || filterDepartment ? 'Try adjusting your search filters to find more stories' : 'No testimonials available at the moment'}
                </p>
                {(searchTerm || filterDepartment) && (
                  <button
                    onClick={() => {
                      handleClearSearch();
                      handleClearFilter('department');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                  {currentTestimonials.map((testimonial, index) => (
                    <div 
                      key={testimonial.id} 
                      className="group relative cursor-pointer"
                      onClick={() => openModal(testimonial)}
                    >
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                        
                        {/* Quote */}
                        <div className="flex items-start justify-end mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center opacity-60">
                            <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Testimonial Content */}
                        <div className="flex-1 mb-6">
                          <blockquote className="text-gray-700 leading-relaxed text-sm line-clamp-6">
                            "{testimonial.content}"
                          </blockquote>
                        </div>

                        {/* Alumni Info */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center space-x-3">
                            {/* Profile Image or Avatar */}
                            <div className="flex-shrink-0">
                              {testimonial.user?.photoUrl ? (
                                <img
                                  src={testimonial.user.photoUrl}
                                  alt={testimonial.user.fullName}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm ${testimonial.user?.photoUrl ? 'hidden' : 'flex'}`}
                              >
                                {getUserInitials(testimonial.user)}
                              </div>
                            </div>
                            
                            {/* Alumni Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 truncate">
                                {testimonial.user?.fullName}
                              </h3>
                              <p className="text-indigo-600 font-medium text-xs truncate">
                                {testimonial.user?.alumni?.currentJobTitle}
                              </p>
                              <p className="text-gray-500 text-xs truncate">
                                {testimonial.user?.alumni?.companyName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      Next
                      <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Share Your Success Story
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join the inspiring voices of our alumni community. Your journey could inspire the next generation of innovators and leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/role-selection')}
                className="group relative px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10">Join Alumni Network</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Share Your Success Story
              </button>
            </div>
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && selectedTestimonial && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Testimonial Details</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quote */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <blockquote className="text-gray-700 leading-relaxed text-lg">
                      "{selectedTestimonial.content}"
                    </blockquote>
                  </div>
                </div>

                {/* Alumni Details */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    {selectedTestimonial.user?.photoUrl ? (
                      <img
                        src={selectedTestimonial.user.photoUrl}
                        alt={selectedTestimonial.user.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {getUserInitials(selectedTestimonial.user)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedTestimonial.user?.fullName}
                      </h4>
                      <p className="text-indigo-600 font-semibold">
                        {selectedTestimonial.user?.alumni?.currentJobTitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Company</div>
                        <div className="text-gray-900">{selectedTestimonial.user?.alumni?.companyName || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Department</div>
                        <div className="text-gray-900">{selectedTestimonial.user?.department || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Graduation Year</div>
                        <div className="text-gray-900">Class of {selectedTestimonial.user?.alumni?.graduationYear || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-600">Location</div>
                        <div className="text-gray-900">{selectedTestimonial.user?.alumni?.currentLocation || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestimonialsPage;