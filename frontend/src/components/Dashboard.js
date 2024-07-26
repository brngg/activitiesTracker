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
      const response = await axios.get(API_URL);
      setItems(response.data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    }
  };

  const addItem = async (newItem) => {
    try {
      const response = await axios.post(API_URL, newItem);
      setItems(prevItems => [...prevItems, response.data]);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  const deleteItem = async (name) => {
    try {
      await axios.delete(`${API_URL}/${encodeURIComponent(name)}`);
      setItems(prevItems => prevItems.filter(item => item.name !== name));
      setError(null); // Clear any previous errors
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
