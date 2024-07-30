import React, { useState } from 'react';
import AddItemForm from './AddItemForm';
import ItemList from './ItemList';

function Dashboard() {
  const [error, setError] = useState(null);

  const handleSetError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Item Dashboard</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      <ItemList setError={handleSetError} />
    </div>
  );
}

export default Dashboard;
