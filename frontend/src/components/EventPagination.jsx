import React from 'react';

const EventPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Helper to generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    // Show up to 2 before and after current
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-white text-gray-600 hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-600 border border-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
      {/* First page and ellipsis */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-white text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
          >
            1
          </button>
          {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}
      {/* Page numbers */}
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-full px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-105 border ${
            page === currentPage
              ? 'bg-primary text-white shadow-lg scale-105 border-primary'
              : 'bg-white text-primary hover:bg-primary hover:text-white hover:shadow-lg border-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      {/* Last page and ellipsis */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-full px-4 py-2 text-sm font-semibold bg-white text-primary hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-white text-gray-600 hover:bg-primary hover:text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-600 border border-gray-200"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventPagination; 