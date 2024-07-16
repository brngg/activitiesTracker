const Neighborhood = require('../models/neighborhood');

const handleError = (res, errorMessage, error) => {
  console.error(`Error in ${errorMessage}:`, error);
  res.status(500).json({ message: `Error retrieving ${errorMessage}`, error: error.message });
};

const getDistinctField = async (field, filter = {}) => {
  try {
    return await Neighborhood.distinct(field, filter);
  } catch (error) {
    throw new Error(`Error fetching distinct ${field}: ${error.message}`);
  }
};

const getBoroughs = async (req, res) => {
  try {
    const boroughs = await getDistinctField('borough');
    res.status(200).json(boroughs);
  } catch (error) {
    handleError(res, 'boroughs', error);
  }
};

const getNeighborhoodsByBorough = async (req, res) => {
  try {
    const { borough } = req.params;
    const neighborhoods = await getDistinctField('neighborhood', { borough });
    res.status(200).json(neighborhoods);
  } catch (error) {
    handleError(res, 'neighborhoods', error);
  }
};

const getZipcodesByBoroughAndNeighborhood = async (req, res) => {
  try {
    const { borough, neighborhood } = req.params;
    console.log('Querying with Borough:', borough, 'and Neighborhood:', neighborhood);
    const zipcodes = await getDistinctField('zipcode', { borough, neighborhood });

    if (zipcodes.length === 0) {
      return res.status(404).json({ message: 'No zipcodes found for the requested borough and neighborhood.' });
    }

    res.status(200).json(zipcodes);
  } catch (error) {
    console.error('Error retrieving zipcodes:', error.message); // Log error message
    res.status(500).json({ message: 'Error retrieving zipcodes', error: error.message });
  }
};

module.exports = {
  getBoroughs,
  getNeighborhoodsByBorough,
  getZipcodesByBoroughAndNeighborhood
};
