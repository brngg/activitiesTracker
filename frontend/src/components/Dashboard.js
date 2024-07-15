import React, { useState, useEffect } from 'react';
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
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load items. Please try again later.');
    }
  };

  const addItem = async (newItem) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      const addedItem = await response.json();
      setItems(prevItems => [...prevItems, addedItem]);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    }
  };

  const deleteItem = async (name) => {
    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setItems(prevItems => prevItems.filter(item => item.name !== name));
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <h1>Item Dashboard</h1>
      {error && <div className="error-message">{error}</div>}
      <AddItemForm addItem={addItem} />
      <ItemList items={items} deleteItem={deleteItem} />
    </div>
  );
}

export default Dashboard;