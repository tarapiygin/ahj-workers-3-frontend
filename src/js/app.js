import NewsWidget from './NewsWidget';

const URL = 'https://ahj-workers-3-backend.herokuapp.com/';

if (navigator.serviceWorker) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(
        '/service.worker.js',
        { scope: './' },
      );
    } catch (e) {
      console.log(e);
    }
  });
}

new NewsWidget(URL).update();
