import React from 'react';

const JobPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Helper to generate page numbers for display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 border border-white/20 font-body"
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
            className="rounded-xl px-4 py-3 text-sm font-semibold bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 font-body"
          >
            1
          </button>
          {currentPage > 4 && <span className="px-2 text-white/60">...</span>}
        </>
      )}
      
      {/* Page numbers */}
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 transform hover:scale-105 font-body ${
            page === currentPage
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl scale-105 border border-primary-400/30'
              : 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Last page and ellipsis */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2 text-white/60">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-xl px-4 py-3 text-sm font-semibold bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 font-body"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 border border-white/20 font-body"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default JobPagination; 