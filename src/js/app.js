import NewsWidget from './NewsWidget';

const URL = 'http://localhost:7070/';

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
