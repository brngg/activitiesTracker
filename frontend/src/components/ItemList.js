import React from 'react';
import PropTypes from 'prop-types';

const ItemList = ({ items, deleteItem }) => {
  if (items.length === 0) {
    return <p>No items to display.</p>;
  }

  return (
    <div className="item-list">
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="item-list__item">
            <h3>{item.name}</h3>
            <p>Type: {item.type}</p>
            <p>Location: {item.location.city}, {item.location.borough}</p>
            <p>Address: {item.location.address}, {item.location.zipcode}</p>
            <p>Status: {item.status ? 'Active' : 'Inactive'}</p>
            <button
              onClick={() => deleteItem(item.name)}
              className="item-list__delete-btn"
              aria-label={`Delete ${item.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      location: PropTypes.shape({
        city: PropTypes.string,
        borough: PropTypes.string,
        address: PropTypes.string,
        zipcode: PropTypes.string,
      }),
      status: PropTypes.bool,
    })
  ).isRequired,
  deleteItem: PropTypes.func.isRequired,
};

export default ItemList;