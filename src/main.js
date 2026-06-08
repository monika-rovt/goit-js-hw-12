import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, showLoader, showLoadMoreButton } from './js/render-functions';



const form = document.querySelector('.form');
const galleryContainer = document.querySelector('.gallery');
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
    

   if (data.totalHits <= perPage) {

      hideLoadMoreButton();
iziToast.info({
        title: 'Увага',
        message: 'Ви переглянули всі доступні зображення за вашим запитом.',
        position: 'topRight',
        timeout: 4000
    });

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
scrollToNextGroup();


    // Перевіряємо, чи дійшли ми до кінця списку
    const totalPages = Math.ceil(data.totalHits / perPage);
    
    if (page >= totalPages) {
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
      hideLoadMoreButton(); 
    } else {
      showLoadMoreButton();
    }
    
  } catch (error) {
    iziToast.error({ message: 'Сталася помилка під час завантаження. Спробуйте ще раз.' });
  console.error(error);
  } finally {
    // Ховаємо індикатор після того, як домалювали елементи
    hideLoader();
  }
});
async function scrollToNextGroup() {
  const galleryItems = document.querySelectorAll('.gallery a'); // або ваш клас елемента
  
  if (galleryItems.length > 0) {
    // Отримуємо висоту першого елемента галереї
    const firstItemHeight = galleryItems[0].getBoundingClientRect().height;
    
    // Прокручуємо на висоту двох рядів (або одного елемента, залежно від дизайну)
    window.scrollBy({
      top: firstItemHeight * 2, 
      behavior: 'smooth'
    });
  }
}
