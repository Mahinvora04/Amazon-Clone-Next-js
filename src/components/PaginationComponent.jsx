import React from "react";

const pageSizes = [2, 5, 10, 20, 50, 100];

const PaginationComponent = ({
  totalDataCount,
  pageSize,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const totalPages = Math.ceil(totalDataCount / pageSize);

  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages = [1, 2, 3, "...", totalPages];
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white shadow rounded-md">
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

        {getPaginationItems().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`px-3 py-1 rounded-md hover:cursor-pointer ${
                page === currentPage
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span> (
        {totalDataCount} items)
      </div>

      {/* Page Size Dropdown */}
      <div>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="border border-gray-200 rounded-md px-2 py-1 bg-white focus:ring focus:border-black-100 hover:cursor-pointer"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size} >
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationComponent;
