const Neighborhood = require('../models/neighborhood');

const handleError = (res, errorMessage, error) => {
  console.error(`Error in ${errorMessage}:`, error);
  res.status(500).json({ message: `Error retrieving ${errorMessage}`, error: error.message });
};

const getDistinctField = async (field, filter = {}) => {
  try {
    //console.log(`Fetching distinct ${field} with filter:`, filter);
    // Convert string values in the filter to case-insensitive regular expressions
    const caseInsensitiveFilter = Object.entries(filter).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? new RegExp(`^${value}$`, 'i') : value;
      return acc;
    }, {});
    const result = await Neighborhood.distinct(field, caseInsensitiveFilter);
    //console.log(`Found ${result.length} distinct ${field}:`, result);
    return result;
  } catch (error) {
    console.error(`Error fetching distinct ${field}:`, error);
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
    //console.log(`Searching for neighborhoods in borough: ${borough}`);
    const neighborhoods = await getDistinctField('neighborhood', { borough });
    if (neighborhoods.length === 0) {
      //console.log(`No neighborhoods found for borough: ${borough}`);
      return res.status(404).json({ message: `No neighborhoods found for borough: ${borough}` });
    }
    //console.log(`Found ${neighborhoods.length} neighborhoods in ${borough}`);
    res.status(200).json(neighborhoods);
  } catch (error) {
    handleError(res, 'neighborhoods', error);
  }
};

const getZipcodesByBoroughAndNeighborhood = async (req, res) => {
  try {
    const { borough, neighborhood } = req.params;
    //console.log(`Searching for zipcodes in ${neighborhood}, ${borough}`);
    if (!borough || !neighborhood) {
      return res.status(400).json({ message: 'Borough and neighborhood parameters are required' });
    }
    const zipcodes = await getDistinctField('zipcode', { borough, neighborhood });
    if (zipcodes.length === 0) {
      //console.log(`No zipcodes found for ${neighborhood} in ${borough}`);
      return res.status(404).json({ message: 'No zipcodes found for the requested borough and neighborhood.' });
    }
    //console.log(`Found ${zipcodes.length} zipcodes for ${neighborhood} in ${borough}`);
    res.status(200).json(zipcodes);
  } catch (error) {
    console.error('Error retrieving zipcodes:', error.message);
    handleError(res, 'zipcodes', error);
  }
};

module.exports = {
  getBoroughs,
  getNeighborhoodsByBorough,
  getZipcodesByBoroughAndNeighborhood
};