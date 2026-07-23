export const fetchGoogleReviews = async (placeId, apiKey) => {
  // ---------------------------------------------------------
  // MOCK DATA FALLBACK FOR LOCAL DEV (IF API KEY IS MISSING)
  // ---------------------------------------------------------
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn('Google Places API key is missing. Using mock data for reviews.');
    return {
      user_ratings_total: 1204,
      reviews: [{
        author_name: 'John Doe',
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://i.pravatar.cc/150?u=1',
        rating: 5,
        relative_time_description: 'a month ago',
        text: 'Great doctor!',
        time: 1234567890
      }, {
        author_name: 'Jane Smith',
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://i.pravatar.cc/150?u=2',
        rating: 4,
        relative_time_description: '2 months ago',
        text: 'Very professional.',
        time: 1234567890
      }, {
        author_name: 'Bob Johnson',
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://i.pravatar.cc/150?u=3',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Highly recommend.',
        time: 1234567890
      }, {
        author_name: 'Alice Brown',
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://i.pravatar.cc/150?u=4',
        rating: 5,
        relative_time_description: '4 months ago',
        text: 'The best experience.',
        time: 1234567890
      }, {
        author_name: 'Charlie Davis',
        author_url: '',
        language: 'en',
        profile_photo_url: 'https://i.pravatar.cc/150?u=5',
        rating: 5,
        relative_time_description: '5 months ago',
        text: 'Would come again.',
        time: 1234567890
      }]
    };
  }

  // ---------------------------------------------------------
  // REAL API REQUEST
  // ---------------------------------------------------------
  try {
    // Note: Due to CORS, hitting this directly from the browser might be blocked depending on how the Google Cloud project is configured.
    // If blocked, you will need a lightweight proxy backend, or use the Google Maps Javascript API Library instead.
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,user_ratings_total&key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Google Places API returned ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return {};
  }
};