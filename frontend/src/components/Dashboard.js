import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemList from './ItemList';
import AddItemForm from './AddItemForm';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/items`;

function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    }
  };

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
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        setError(`Failed to add item: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('Failed to add item: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(`Failed to add item: ${error.message}`);
      }
    }
  };

  const deleteItem = async (name) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${encodeURIComponent(name)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prevItems => prevItems.filter(item => item.name !== name));
      setError(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Item Dashboard</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}
      <AddItemForm addItem={addItem} />
      <ItemList items={items} deleteItem={deleteItem} />
    </div>
  );
}

export default Dashboard;