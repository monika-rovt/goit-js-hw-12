import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, showLoader, showLoadMoreButton } from './js/render-functions';



const form = document.querySelector('.form');
const searchInput = document.querySelector('.input');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let query = '';

if (form)
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearGallery();
  query = event.currentTarget.elements['search-text'].value.trim();

  // Перевірка на пустий рядок
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Будь ласка, введіть значення!',
      position: 'topRight',
    });
    return;
  }
 clearGallery();
  showLoader();
 
  page = 1;
  hideLoadMoreButton();

  try {
    hideLoader();

    const data = await getImagesByQuery(query, page);
    
    // Перевірка чи знайдено хоч якісь зображення
    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    // Успішний результат, малюємо галерею
    createGallery(data.hits);
    iziToast.success({
      title: 'Success',
      message: `Ми знайшли ${data.hits.length} зображень!`,
      position: 'topRight',
    });
   if (data.totalHits > perPage) {
      showLoadMoreButton();
    }

  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Сталася помилка під час завантаження. Спробуйте пізніше!',
      position: 'topRight',
    });
    console.error('Fetch error:', error);
  } finally {
    hideLoader();
    event.target.reset(); // Очищаємо форму після виконання
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1; // Збільшуємо сторінку для наступного запиту

  // Ховаємо кнопку на час завантаження наступної порції та показуємо індикатор
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // Перевіряємо, чи дійшли ми до кінця списку
    const totalPages = Math.ceil(data.totalHits / perPage);
    
    if (page >= totalPages) {
      alert("We're sorry, but you've reached the end of search results.");
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Помилка завантаження:', error);
  } finally {
    // Ховаємо індикатор після того, як домалювали елементи
    hideLoader();
  }
});
function scrollToNextGroup() {
  const firstCard = refs.gallery.firstElementChild;
  
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}