import React from 'react';

const EventPagination = ({ currentPage, totalPages, onPageChange }) => {
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
        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/80 border border-slate-200 font-body"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      
      {/* First page and ellipsis - only show if there are enough pages */}
      {currentPage > 4 && totalPages > 6 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-xl px-4 py-3 text-sm font-semibold bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white transition-all duration-300 transform hover:scale-105 border border-slate-200 font-body"
          >
            1
          </button>
          {currentPage > 5 && <span className="px-2 text-slate-500">...</span>}
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
              : 'bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white border border-slate-200'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Last page and ellipsis - only show if there are enough pages */}
      {currentPage < totalPages - 3 && totalPages > 6 && (
        <>
          {currentPage < totalPages - 4 && <span className="px-2 text-slate-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-xl px-4 py-3 text-sm font-semibold bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white transition-all duration-300 transform hover:scale-105 border border-slate-200 font-body"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-white/80 backdrop-blur-xl text-slate-700 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/80 border border-slate-200 font-body"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default EventPagination; 