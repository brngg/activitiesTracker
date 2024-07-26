const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: {
    neighborhood: { type: String, required: true },
    borough: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{5}$/.test(v); // Regular expression for 5-digit zip code
        },
        message: props => `${props.value} is not a valid 5-digit zip code!`
      }
    }
  },
  dateAdded: { type: Date, default: Date.now },
  status: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Item', itemSchema);
