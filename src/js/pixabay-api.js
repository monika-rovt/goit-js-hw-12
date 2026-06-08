import axios from 'axios';

const API_KEY = '56203683-dd16d7902fd33711f42dee53b';
const BASE_URL = 'https://pixabay.com/api/';

let previousQuery = '';
let page = 1;
const perPage = 15;

export async function getImagesByQuery(query, page) {
if (query !== previousQuery) {
    page = 1;
    // previousQuery = query;
  }

  try {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: perPage,
    },
  });
return response.data;
} catch (error) {
  console.error('Error', error);
  throw error;
}
  
}