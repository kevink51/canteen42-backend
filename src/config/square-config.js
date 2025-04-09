// Square configuration
// In production, these values would be loaded from environment variables
const square = {
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  locationId: process.env.SQUARE_LOCATION_ID
};

module.exports = square;
