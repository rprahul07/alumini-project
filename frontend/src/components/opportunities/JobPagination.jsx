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
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>
      {/* First page and ellipsis */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-full px-3 py-1.5 text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-50"
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
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-indigo-600 hover:bg-indigo-50'
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
            className="rounded-full px-3 py-1.5 text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-50"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default JobPagination; 