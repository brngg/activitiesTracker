import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AddItemForm = ({ addItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: {
      city: '',
      borough: '',
      neighborhood: '',
      address: '',
      zipcode: ''
    },
    status: false
  });

  const [boroughs, setBoroughs] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [zipcodes, setZipcodes] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/neighborhoods`)
      .then(response => {
        console.log('Boroughs fetched:', response.data);
        setBoroughs(response.data);
      })
      .catch(error => {
        console.error('Error fetching boroughs:', error);
      });
  }, []);

  const handleBoroughChange = (event) => {
    const { value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        borough: value,
        neighborhood: '',
        zipcode: ''
      }
    }));

    axios.get(`${API_BASE_URL}/neighborhoods/${value}`)
      .then(response => {
        console.log('Neighborhoods fetched for borough:', response.data);
        setNeighborhoods(response.data);
      })
      .catch(error => {
        console.error('Error fetching neighborhoods:', error);
      });
  };

  const handleNeighborhoodChange = (event) => {
    const { value } = event.target;
    console.log('Neighborhood selected:', value);
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        neighborhood: value,
        zipcode: ''
      }
    }));
  
    if (value && formData.location.borough) {
      console.log('Fetching zipcodes for:', formData.location.borough, value);
      axios.get(`${API_BASE_URL}/neighborhoods/${formData.location.borough}/${value}`)
        .then(response => {
          console.log('Zipcodes fetched:', response.data);
          setZipcodes(response.data);
        })
        .catch(error => {
          console.error('Error fetching zipcodes:', error);
        });
    } else {
      setZipcodes([]);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addItem(formData);
    setFormData({
      name: '',
      type: '',
      location: {
        city: '',
        borough: '',
        neighborhood: '',
        address: '',
        zipcode: ''
      },
      status: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Activity Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter activity name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type of Activity</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Type</option>
            {[
              'Restaurant',
              'Outdoor',
              'Shopping',
              'Entertainment',
              'Fitness',
              'Cultural',
              'Educational',
              'Nightlife',
              'Other'
            ].map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Borough</label>
          <select
            name="location.borough"
            value={formData.location.borough}
            onChange={handleBoroughChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Borough</option>
            {boroughs.map((borough, index) => (
              <option key={index} value={borough}>{borough}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Neighborhood</label>
          <select
            name="location.neighborhood"
            value={formData.location.neighborhood}
            onChange={handleNeighborhoodChange}
            disabled={!formData.location.borough}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Neighborhood</option>
            {neighborhoods.map((neighborhood, index) => (
              <option key={index} value={neighborhood}>{neighborhood}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Zipcode</label>
          <select
            name="location.zipcode"
            value={formData.location.zipcode}
            onChange={handleChange}
            disabled={!formData.location.neighborhood}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Zipcode</option>
            {zipcodes.map((zipcode, index) => (
              <option key={index} value={zipcode}>{zipcode}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
        <input
          type="text"
          name="location.address"
          value={formData.location.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <button 
          type="submit" 
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
        >
          Add Item
        </button>
      </div>
    </form>
  );
};

AddItemForm.propTypes = {
  addItem: PropTypes.func.isRequired,
};

export default AddItemForm;