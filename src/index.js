import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { countryСardTeemplate, countryListTemplate } from './js/markupTemplate';
import { refs } from './js/refs-elements';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
refs.searchBox.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function onInputCountry(e) {
  e.preventDefault();
  const countryName = refs.searchBox.value.trim();
  if (countryName === '') {
    clearData();
    return;
  }

  fetchCountries(countryName)
    .then(countrys => {
      //Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным.
      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearData();
        return;
      }

      //Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. Каждый элемент списка состоит из флага и имени страны.
      if (countrys.length >= 2 && countrys.length <= 10) {
        const listMarkup = countrys.map(country =>
          countryListTemplate(country)
        );
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countrys.length === 1) {
        const markup = countrys.map(country => countryСardTeemplate(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearData();
      return error;
    });
}

function clearData() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

// console.log();
