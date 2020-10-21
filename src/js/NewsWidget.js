import moment from 'moment';

export default class NewsWidget {
  constructor(URL) {
    this.URL = `${URL}news`;
    this.element = document.querySelector('.news-widget');
    this.newsListEl = this.element.querySelector('.news_list');
    this.errorModalEl = this.element.querySelector('.error_modal');
    this.updateButtonEl = this.element.querySelector('.news_update-button');

    this.registerEvents();
  }

  static renderNewsItem(item) {
    const HTML = `<div class="news-item">
    <div class="news-item_date">${moment(item.date).format('hh:mm MM.DD.YYYY')}</div>
    <div class="news-item-content">
      <div class="news-item-content_image-container">
        <img class="news-item-content_image" src="${item.image.src}" alt="${item.description}">
      </div>
      <div class="news-item-content_text">
      <p class="news-item-content_description">${item.description}</p>
      </div>
    </div>
  </div>`;
    return HTML;
  }

  showDownloadMarkup() {
    const HTML = `<div class="news-item">
    <div class="news-item_date"></div>
    <div class="news-item-content">
      <div class="news-item-content_image-container">

      </div>
      <div class="news-item-content_text">
        <p class="news-item-content_description"></p>
      </div>
    </div>
  </div>

  <div class="news-item">
    <div class="news-item_date"></div>
    <div class="news-item-content">
      <div class="news-item-content_image-container">

      </div>
      <div class="news-item-content_text">
        <p class="news-item-content_description"></p>
      </div>
    </div>
  </div>

  <div class="news-item">
    <div class="news-item_date"></div>
    <div class="news-item-content">
      <div class="news-item-content_image-container">

      </div>
      <div class="news-item-content_text">
        <p class="news-item-content_description"></p>
      </div>
    </div>
  </div>`;
    this.newsListEl.innerHTML = HTML;
    this.element.classList.add('download');
  }

  showError() {
    this.errorModalEl.classList.remove('hidden');
  }

  drawNewsList(newsList) {
    let HTML = '';
    newsList.forEach((item) => {
      HTML += NewsWidget.renderNewsItem(item);
    });
    this.newsListEl.innerHTML = HTML;
    this.element.classList.remove('download');
  }

  async getNewsData() {
    try {
      this.showDownloadMarkup();
      const response = await fetch(this.URL);
      if (response.ok) {
        // если HTTP-статус в диапазоне 200-299
        const data = await response.json();
        return data;
      }
      throw new Error('Ответ сети был не ok.');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update() {
    try {
      const data = await this.getNewsData();
      this.drawNewsList(data.newsList);
    } catch (error) {
      this.showError();
    }
  }

  registerEvents() {
    this.updateButtonEl.addEventListener('click', this.update.bind(this));
  }
}
