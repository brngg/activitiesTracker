import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ACTIVITY_TYPES = [
  'Restaurant',
  'Outdoor',
  'Shopping',
  'Entertainment',
  'Fitness',
  'Cultural',
  'Educational',
  'Nightlife',
  'Other'
];

const ItemList = ({ items, deleteItem, editItem, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBorough, setFilterBorough] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [boroughs, setBoroughs] = useState([]);

  useEffect(() => {
    const uniqueBoroughs = [...new Set(items.map(item => item.location.borough))];
    setBoroughs(uniqueBoroughs);
  }, [items]);

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || item.type === filterType) &&
      (filterBorough === '' || item.location.borough === filterBorough) &&
      (filterStatus === '' || item.status.toString() === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'borough') return a.location.borough.localeCompare(b.location.borough);
      if (sortBy === 'status') return a.status === b.status ? 0 : a.status ? -1 : 1;
      return 0;
    });

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search activities..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Filter by Type</option>
          {ACTIVITY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={filterBorough}
          onChange={(e) => setFilterBorough(e.target.value)}
        >
          <option value="">Filter by Borough</option>
          {/* Add borough options dynamically based on your data */}
        </select>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="type">Sort by Type</option>
          <option value="borough">Sort by Borough</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredItems.map(item => (
            <tr key={item._id} className="border-b border-gray-200">
              <td className="px-6 py-4 text-sm text-gray-900 text-left">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">
                <div>{item.location.neighborhood}, {item.location.borough}</div>
                <div>{item.location.address}, {item.location.zipcode}</div>
              </td>
              <td className="px-6 py-4 text-sm text-left">
                <span className={`${item.status ? 'text-green-600' : 'text-red-600'}`}>
                  {item.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button 
                  onClick={() => toggleFavorite(item.name)} 
                  className={`text-yellow-500 hover:text-yellow-600 mr-2 ${item.isFavorite ? 'text-yellow-600' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                <button
                  onClick={() => editItem(item.name)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.name)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === index + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(ACTIVITY_TYPES).isRequired,
      location: PropTypes.shape({
        neighborhood: PropTypes.string,
        borough: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        zipcode: PropTypes.string.isRequired
      }).isRequired,
      status: PropTypes.bool.isRequired
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired
};

export default ItemList;