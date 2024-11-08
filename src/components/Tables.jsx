import React, { useState, useMemo } from "react";
import _ from "lodash";

const Tables = ({ columns, data, config = {} }) => {
  const [sortConfig, setSortConfig] = useState([]);
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Default config settings with fallbacks
  const {
    enableSearch = true,
    enablePagination = true,
    enableSorting = true,
    enableEntriesPerPage = true,
    enableClearFilter = false,
    defaultEntriesPerPage = 10,
  } = config;

  // Sorting function
  const handleSort = (key) => {
    if (!enableSorting) return;

    setSortConfig((prevConfig) => {
      const existingSort = prevConfig.find((sort) => sort.key === key);
      if (existingSort) {
        if (existingSort.direction === "asc") {
          return prevConfig.map((sort) =>
            sort.key === key ? { ...sort, direction: "desc" } : sort
          );
        } else {
          return prevConfig.filter((sort) => sort.key !== key);
        }
      } else {
        return [...prevConfig, { key, direction: "asc" }];
      }
    });
  };

  // Sorting and filtering logic
  const sortedData = useMemo(() => {
    if (sortConfig.length) {
      const keys = sortConfig.map((sort) => sort.key);
      const orders = sortConfig.map((sort) => sort.direction);
      return _.orderBy(data, keys, orders);
    }
    return data;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (searchTerm && enableSearch) {
      return sortedData.filter((row) =>
        columns.some((column) =>
          String(row[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
    return sortedData;
  }, [sortedData, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, page, entriesPerPage]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const clearFilters = () => {
    setSortConfig([]);
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        {/* Entries per page dropdown */}
        {enableEntriesPerPage && (
          <div className="flex items-center">
            <label htmlFor="entriesPerPage" className="mr-2">
              Show
            </label>
            <select
              id="entriesPerPage"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border p-1 rounded"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
        )}

        {/* Search input */}
        {enableSearch && (
          <div className="flex justify-end sm:justify-start">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-1 rounded w-full sm:w-64"
            />
          </div>
        )}

        {/* Clear filters button */}
        {enableClearFilter && (
          <button
            onClick={clearFilters}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  onClick={() => handleSort(column.accessor)}
                  className={`py-2 px-4 border-b border-gray-200 text-left text-gray-600 ${
                    enableSorting ? "cursor-pointer" : ""
                  }`}
                >
                  {column.Header}
                  {enableSorting &&
                    sortConfig.find((sort) => sort.key === column.accessor) && (
                      <span className="ml-1">
                        {sortConfig.find((sort) => sort.key === column.accessor)
                          .direction === "asc"
                          ? "▲"
                          : "▼"}
                      </span>
                    )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="py-2 px-4 border-b border-gray-200 text-gray-800"
                    >
                      {row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      {enablePagination && (
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 space-y-2 sm:space-y-0">
          <div className="text-gray-600 text-sm">
            Showing{" "}
            {filteredData.length === 0 ? 0 : (page - 1) * entriesPerPage + 1} to{" "}
            {Math.min(page * entriesPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          {filteredData.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="p-1 border rounded disabled:opacity-50"
              >
                &laquo; First
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1 border rounded disabled:opacity-50"
              >
                &lt; Prev
              </button>
              <span className="text-gray-600 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || paginatedData.length === 0}
                className="p-1 border rounded disabled:opacity-50"
              >
                Next &gt;
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages || paginatedData.length === 0}
                className="p-1 border rounded disabled:opacity-50"
              >
                Last &raquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tables;
