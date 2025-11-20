  let map;
  let placemarks = [];

  ymaps.ready(function () {
    map = new ymaps.Map('map', {
      center: [55.317231, 36.825535],
      zoom: window.innerWidth > 900 ? 9 : 8,
      controls: ['zoomControl', 'fullscreenControl']
    });

    function createPlacemark(coords, number, hint, balloon) {
      return new ymaps.Placemark(coords, {
        hintContent: hint,
        balloonContent: balloon,
        iconContent: number
      }, {
        preset: 'islands#blueNumberIcon'
      });
    }

    const placemark1 = createPlacemark([55.384665, 36.725096], '1', 'Code_Gap Наро-Фоминск', 'Наро-Фоминск, ул. Маршала Жукова 6Б (БЦ "Корвет")');
    const placemark2 = createPlacemark([55.117184, 36.616150], '2', 'Code_Gap Обнинск', 'Обнинск, ул. Аксёнова 18Б (ДЦ "Арена")');
    const placemark3 = createPlacemark([55.516979, 36.983023], '3', 'Code_Gap Селятино', 'Селятино, ул. Спортивная 5/1 (Библиотека)');

    placemark1.properties.set('id', 1);
    placemark2.properties.set('id', 2);
    placemark3.properties.set('id', 3);

    placemarks = [placemark1, placemark2, placemark3];

    map.geoObjects.add(placemark1);
    map.geoObjects.add(placemark2);
    map.geoObjects.add(placemark3);

    // === Подсветка карточки и метки ===
    setTimeout(() => {
      const addressCards = document.querySelectorAll('.address-card');

      addressCards.forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt(card.getAttribute('data-id'));
          const placemark = placemarks.find(pm => pm.properties.get('id') === id);

          // Снимаем активный класс со всех
          addressCards.forEach(c => c.classList.remove('active'));
          // Добавляем текущей
          card.classList.add('active');

          if (placemark) {
            map.setCenter(placemark.geometry.getCoordinates(), 14, { duration: 1000 });
            placemark.balloon.open();

            placemark.options.set('preset', 'islands#redNumberIcon');
            setTimeout(() => {
              placemark.options.set('preset', 'islands#blueNumberIcon');
            }, 2000);
          }
        });
      });
    }, 500);
  });
  document.addEventListener('click', (e) => {
  if (!e.target.closest('.address-card')) {
    document.querySelectorAll('.address-card').forEach(c => c.classList.remove('active'));
  }
});