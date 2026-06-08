import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader'); 
const loadMoreBtn = document.querySelector('.load-more');



export function createGallery(images) {
  clearGallery();
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
          </div>
        </li>
      `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();

 }

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  if (loader){
  loader.classList.remove('is-hidden'); 
  }
}

export function hideLoader() {
  if (loader)
  {loader.classList.add('is-hidden');}
  else {
    console.warn('Element is apsent');
    
  }
}

export function showLoadMoreButton() {
  if (loadMoreBtn){
  loadMoreBtn.classList.remove('is-hidden'); 
  }
}

export function hideLoadMoreButton() {
  if (loadMoreBtn)
  {loadMoreBtn.classList.add('is-hidden');}
  else {
    console.warn('Element is apsent');
    }
}