import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddItemForm = ({ addItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: {
      city: '',
      borough: '',
      address: '',
      zipcode: ''
    },
    status: false
  });

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
        address: '',
        zipcode: ''
      },
      status: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Activity Name"
        required
      />
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Type of Activity"
      />
      <input
        type="text"
        name="location.city"
        value={formData.location.city}
        onChange={handleChange}
        placeholder="City"
      />
      <input
        type="text"
        name="location.borough"
        value={formData.location.borough}
        onChange={handleChange}
        placeholder="Borough"
      />
      <input
        type="text"
        name="location.address"
        value={formData.location.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        type="text"
        name="location.zipcode"
        value={formData.location.zipcode}
        onChange={handleChange}
        placeholder="Zipcode"
      />
      <label>
        Status:
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Add Item</button>
    </form>
  );
};

AddItemForm.propTypes = {
  addItem: PropTypes.func.isRequired,
};

export default AddItemForm;