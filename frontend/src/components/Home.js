import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-indigo-600">My Adventure List</h1>
        <p className="text-xl text-gray-600 mt-2">Discover exciting activities inspired by social media influencers</p>
      </header>
      
      {/* Placeholder for SearchBar */}
      <div className="my-4">
        <input type="text" placeholder="Search activities..." className="w-full p-2 border rounded" />
      </div>
      
      <main className="mt-8">
        {/* Placeholder for ActivityList */}
        <p>Activity list will be displayed here</p>
      </main>
      
      <button className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300">
        Add New Activity
      </button>
    </div>
  );
};

export default Home;
