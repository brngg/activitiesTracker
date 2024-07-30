import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config';
import AddItemForm from './AddItemForm'; // Ensure the AddItemForm component is correctly imported

const API_URL = `${API_BASE_URL}/items`;
const SAVED_ITEMS_URL = `${API_BASE_URL}/items/saved`;

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

const ItemList = ({ setError }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBorough, setFilterBorough] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [boroughs, setBoroughs] = useState([]);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(SAVED_ITEMS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching saved items:', error);
        setError('Failed to fetch saved items. Please try again.');
      }
    };

    fetchSavedItems();
  }, [setError]);

  useEffect(() => {
    const uniqueBoroughs = [...new Set(items.map(item => item.location.borough))];
    setBoroughs(uniqueBoroughs);
  }, [items]);

  const addItem = async (newItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, newItem, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setItems(prevItems => [...prevItems, response.data]);
      setError(null);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, updatedItem, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setItems(prevItems => prevItems.map(item => item._id === id ? response.data : item));
      setError(null);
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item. Please try again.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

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
      <AddItemForm addItem={addItem} setError={setError} />
      
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
          {boroughs.map(borough => (
            <option key={borough} value={borough}>{borough}</option>
          ))}
        </select>
        <select 
          className="p-2 border border-gray-300 rounded-md"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="true">Done</option>
          <option value="false">Not Done</option>
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
          {currentItems.map(item => (
            <tr key={item._id} className="border-b border-gray-200">
              <td className="px-6 py-4 text-sm text-gray-900 text-left">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 text-left">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-left">
                {`${item.location.neighborhood}, ${item.location.borough}, ${item.location.address}, ${item.location.zipcode}`}
              </td>
              <td className="px-6 py-4 text-sm text-left">
                <span className={`${item.status ? 'text-green-600' : 'text-red-600'}`}>
                  {item.status ? 'Done' : 'Not Done'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-600 hover:text-red-900 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => updateItem(item._id, { ...item, status: !item.status })}
                  className="text-blue-600 hover:text-blue-900"
                >
                  {item.status ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= filteredItems.length}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

ItemList.propTypes = {
  setError: PropTypes.func.isRequired,
};

export default ItemList;
